import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, userInfo, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    let dbUser = await prisma.users.findFirst({
      where: { Email: userInfo.email },
    });

    if (!dbUser) {
      dbUser = await prisma.users.create({
        data: {
          Username: userInfo.firstName + userInfo.lastName,
          Email: userInfo.email,
          PasswordHash: "guest_checkout",
        },
      });
    }

    const newOrder = await prisma.orders.create({
      data: {
        UserID: dbUser.UserID,
        TotalAmount: total,
        Status: "Processing",
      },
    });

    for (const item of items) {
      await prisma.orderItems.create({
        data: {
          OrderID: newOrder.OrderID,
          ProductID: item.id,
          Quantity: item.quantity,
          UnitPrice: item.price,
        },
      });

      await prisma.products.update({
        where: { ProductID: item.id },
        data: {
          Stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: `VOID-${newOrder.OrderID}`,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش و ثبت سفارش" },
      { status: 500 },
    );
  }
}
