import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "ایمیل ارسال نشده است" },
        { status: 400 },
      );
    }

    const user = await prisma.users.findFirst({
      where: { Email: email },
    });

    if (!user) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const userOrders = await prisma.orders.findMany({
      where: { UserID: user.UserID },
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
