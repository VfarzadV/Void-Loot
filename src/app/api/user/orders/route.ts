import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const orderIdValue = url.searchParams.get("orderId");
    const orderId = orderIdValue ? Number(orderIdValue) : null;
    if (
      orderIdValue &&
      (orderId === null || !Number.isInteger(orderId) || orderId < 1)
    ) {
      return NextResponse.json({ error: "INVALID_ORDER_ID" }, { status: 400 });
    }

    const userOrders = await prisma.orders.findMany({
      where: {
        UserID: user.id,
        ...(orderId ? { OrderID: orderId } : {}),
      },
      orderBy: { OrderID: "desc" },
      include: {
        OrderItems: {
          include: {
            Products: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تاریخچه سفارشات" },
      { status: 500 },
    );
  }
}
