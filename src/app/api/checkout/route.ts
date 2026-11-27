import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const checkoutItemsSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      quantity: z.number().int().min(1).max(100),
    }),
  )
  .min(1)
  .max(50)
  .superRefine((items, context) => {
    const ids = new Set<number>();
    items.forEach((item, index) => {
      if (ids.has(item.id)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate product",
          path: [index, "id"],
        });
      }
      ids.add(item.id);
    });
  });

const orderSchema = z.object({
  items: checkoutItemsSchema,
  expectedTotal: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
});

type CheckoutItem = z.infer<typeof checkoutItemsSchema>[number];

interface CheckoutQuoteItem {
  id: number;
  title: string;
  image: string | null;
  price: string;
  quantity: number;
  lineTotal: string;
}

interface CheckoutQuote {
  items: CheckoutQuoteItem[];
  subtotal: string;
  tax: string;
  total: string;
}

class CheckoutError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly quote?: CheckoutQuote,
  ) {
    super(code);
  }
}

function createQuote(
  items: CheckoutItem[],
  products: Array<{
    ProductID: number;
    Title: string;
    Price: Prisma.Decimal;
    ImageUrl: string | null;
    Stock: number;
  }>,
): CheckoutQuote {
  const productsById = new Map(
    products.map((product) => [product.ProductID, product]),
  );
  if (productsById.size !== items.length) {
    throw new CheckoutError("PRODUCT_UNAVAILABLE", 404);
  }

  let subtotal = new Prisma.Decimal(0);
  const quoteItems = items.map((item) => {
    const product = productsById.get(item.id);
    if (!product) {
      throw new CheckoutError("PRODUCT_UNAVAILABLE", 404);
    }

    const lineTotal = product.Price.mul(item.quantity).toDecimalPlaces(2);
    subtotal = subtotal.plus(lineTotal);
    return {
      id: product.ProductID,
      title: product.Title,
      image: product.ImageUrl,
      price: product.Price.toFixed(2),
      quantity: item.quantity,
      lineTotal: lineTotal.toFixed(2),
    };
  });

  const tax = subtotal.mul("0.05").toDecimalPlaces(2);
  const total = subtotal.plus(tax).toDecimalPlaces(2);

  return {
    items: quoteItems,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
}

function parseItems(value: string | null) {
  if (!value) return null;

  try {
    const parsed = checkoutItemsSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function errorResponse(error: CheckoutError) {
  return NextResponse.json(
    {
      error: error.code,
      ...(error.quote ? { quote: error.quote } : {}),
    },
    { status: error.status },
  );
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const items = parseItems(searchParams.get("items"));
    if (!items) {
      return NextResponse.json({ error: "INVALID_CART" }, { status: 400 });
    }

    const products = await prisma.products.findMany({
      where: { ProductID: { in: items.map((item) => item.id) } },
      select: {
        ProductID: true,
        Title: true,
        Price: true,
        ImageUrl: true,
        Stock: true,
      },
    });

    return NextResponse.json({ quote: createQuote(items, products) });
  } catch (error) {
    if (error instanceof CheckoutError) return errorResponse(error);
    console.error("Checkout quote error:", error);
    return NextResponse.json({ error: "QUOTE_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_CART" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (transaction) => {
      const products = await transaction.products.findMany({
        where: {
          ProductID: { in: parsed.data.items.map((item) => item.id) },
        },
        select: {
          ProductID: true,
          Title: true,
          Price: true,
          ImageUrl: true,
          Stock: true,
        },
      });
      const quote = createQuote(parsed.data.items, products);
      if (
        new Prisma.Decimal(parsed.data.expectedTotal).comparedTo(quote.total) !==
        0
      ) {
        throw new CheckoutError("PRICE_CHANGED", 409, quote);
      }

      const productsById = new Map(
        products.map((product) => [product.ProductID, product]),
      );
      for (const item of parsed.data.items) {
        const product = productsById.get(item.id);
        if (!product || product.Stock < item.quantity) {
          throw new CheckoutError("STOCK_UNAVAILABLE", 409);
        }

        const stockUpdate = await transaction.products.updateMany({
          where: {
            ProductID: item.id,
            Stock: { gte: item.quantity },
          },
          data: { Stock: { decrement: item.quantity } },
        });
        if (stockUpdate.count !== 1) {
          throw new CheckoutError("STOCK_UNAVAILABLE", 409);
        }
      }

      const createdOrder = await transaction.orders.create({
        data: {
          UserID: user.id,
          TotalAmount: new Prisma.Decimal(quote.total),
          Status: "Pending",
        },
      });

      await transaction.notifications.create({
        data: {
          UserID: user.id,
          EventKey: `order-created:${createdOrder.OrderID}`,
          Type: "order_created",
          ReferenceID: createdOrder.OrderID,
          Details: "Pending",
        },
      });

      await Promise.all(
        parsed.data.items.map((item) => {
          const product = productsById.get(item.id);
          if (!product) {
            throw new CheckoutError("PRODUCT_UNAVAILABLE", 404);
          }

          return transaction.orderItems.create({
            data: {
              OrderID: createdOrder.OrderID,
              ProductID: product.ProductID,
              Quantity: item.quantity,
              UnitPrice: product.Price,
            },
          });
        }),
      );

      return { id: createdOrder.OrderID, total: quote.total };
    });

    return NextResponse.json({
      success: true,
      orderId: `VOID-${order.id}`,
      total: order.total,
      status: "Pending",
    });
  } catch (error) {
    if (error instanceof CheckoutError) return errorResponse(error);
    console.error("Checkout order error:", error);
    return NextResponse.json({ error: "ORDER_FAILED" }, { status: 500 });
  }
}
