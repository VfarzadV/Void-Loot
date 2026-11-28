import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const cartItemsSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      quantity: z.number().int().min(1).max(100),
    }),
  )
  .max(100)
  .superRefine((items, context) => {
    const ids = new Set<number>();
    items.forEach((item, index) => {
      if (ids.has(item.id)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate cart item",
          path: [index, "id"],
        });
      }
      ids.add(item.id);
    });
  });

const wishlistItemsSchema = z
  .array(z.number().int().positive())
  .max(300)
  .superRefine((items, context) => {
    if (new Set(items).size !== items.length) {
      context.addIssue({
        code: "custom",
        message: "Duplicate wishlist item",
      });
    }
  });

const collectionsSchema = z.object({
  cart: cartItemsSchema,
  wishlist: wishlistItemsSchema,
});

async function getCollections(userId: number) {
  const [cartRows, wishlistRows] = await Promise.all([
    prisma.userCartItems.findMany({
      where: { UserID: userId },
      include: {
        Products: {
          select: {
            ProductID: true,
            Title: true,
            Price: true,
            ImageUrl: true,
          },
        },
      },
      orderBy: { AddedAt: "asc" },
    }),
    prisma.userWishlistItems.findMany({
      where: { UserID: userId },
      include: {
        Products: {
          select: {
            ProductID: true,
            Title: true,
            Price: true,
            ImageUrl: true,
          },
        },
      },
      orderBy: { AddedAt: "asc" },
    }),
  ]);

  return {
    cart: cartRows.map((row) => ({
      id: row.Products.ProductID,
      title: row.Products.Title,
      price: Number(row.Products.Price.toString()),
      image: row.Products.ImageUrl || "/images/placeholder.svg",
      quantity: row.Quantity,
    })),
    wishlist: wishlistRows.map((row) => ({
      id: row.Products.ProductID,
      title: row.Products.Title,
      price: Number(row.Products.Price.toString()),
      image: row.Products.ImageUrl || "/images/placeholder.svg",
    })),
  };
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    return NextResponse.json(await getCollections(user.id));
  } catch (error) {
    console.error("Fetch user collections error:", error);
    return NextResponse.json(
      { error: "COLLECTIONS_FAILED" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
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

    const parsed = collectionsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_COLLECTIONS" }, { status: 400 });
    }

    const requestedIds = new Set([
      ...parsed.data.cart.map((item) => item.id),
      ...parsed.data.wishlist,
    ]);
    const products = await prisma.products.findMany({
      where: { ProductID: { in: [...requestedIds] } },
      select: { ProductID: true },
    });
    const availableIds = new Set(products.map((product) => product.ProductID));
    const unavailableProductIds = [...requestedIds].filter(
      (id) => !availableIds.has(id),
    );
    const cart = parsed.data.cart.filter((item) => availableIds.has(item.id));
    const wishlist = parsed.data.wishlist.filter((id) => availableIds.has(id));

    await prisma.$transaction(async (transaction) => {
      await transaction.userCartItems.deleteMany({
        where: { UserID: user.id },
      });
      await transaction.userWishlistItems.deleteMany({
        where: { UserID: user.id },
      });

      for (const item of cart) {
        await transaction.userCartItems.create({
          data: {
            UserID: user.id,
            ProductID: item.id,
            Quantity: item.quantity,
          },
        });
      }

      for (const productId of wishlist) {
        await transaction.userWishlistItems.create({
          data: { UserID: user.id, ProductID: productId },
        });
      }
    });

    return NextResponse.json({
      ...(await getCollections(user.id)),
      unavailableProductIds,
    });
  } catch (error) {
    console.error("Save user collections error:", error);
    return NextResponse.json(
      { error: "COLLECTIONS_FAILED" },
      { status: 500 },
    );
  }
}
