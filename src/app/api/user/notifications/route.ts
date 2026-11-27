import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { getActivePromotions } from "@/lib/promotions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const [orders, promotions] = await Promise.all([
      prisma.orders.findMany({
        where: { UserID: user.id },
        orderBy: { OrderDate: "desc" },
        take: 50,
        select: { OrderID: true, Status: true },
      }),
      getActivePromotions(),
    ]);

    const events = [
      ...orders
        .filter(
          (order) =>
            order.Status &&
            !["pending", "processing"].includes(order.Status.toLowerCase()),
        )
        .map((order) => ({
          eventKey: `order-status:${order.OrderID}:${order.Status}`,
          type: "order_status",
          referenceId: order.OrderID,
          details: order.Status || "",
        })),
      ...promotions.map((promotion) => ({
        eventKey: `promotion:${promotion.id}`,
        type: "promotion",
        referenceId: promotion.id,
        details: promotion.title,
      })),
    ];

    await Promise.all(
      events.map((event) =>
        prisma.notifications.upsert({
          where: {
            UserID_EventKey: {
              UserID: user.id,
              EventKey: event.eventKey,
            },
          },
          update: {},
          create: {
            UserID: user.id,
            EventKey: event.eventKey,
            Type: event.type,
            ReferenceID: event.referenceId,
            Details: event.details,
          },
        }),
      ),
    );

    const notifications = await prisma.notifications.findMany({
      where: { UserID: user.id },
      orderBy: { CreatedAt: "desc" },
      take: 50,
      select: {
        NotificationID: true,
        Type: true,
        ReferenceID: true,
        Details: true,
        IsRead: true,
        CreatedAt: true,
      },
    });

    return NextResponse.json({
      notifications: notifications.map((notification) => ({
        id: notification.NotificationID,
        type: notification.Type,
        referenceId: notification.ReferenceID,
        details: notification.Details,
        isRead: notification.IsRead,
        createdAt: notification.CreatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Fetch user notifications error:", error);
    return NextResponse.json(
      { error: "NOTIFICATIONS_FAILED" },
      { status: 500 },
    );
  }
}

export async function PATCH() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    await prisma.notifications.updateMany({
      where: { UserID: user.id, IsRead: false },
      data: { IsRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return NextResponse.json(
      { error: "NOTIFICATIONS_FAILED" },
      { status: 500 },
    );
  }
}
