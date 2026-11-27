/** @jest-environment node */

import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, PATCH } from "./route";

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/promotions", () => ({
  getActivePromotions: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    orders: { findMany: jest.fn() },
    notifications: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

const mockedUser = jest.mocked(getAuthenticatedUser);
const mockedOrders = jest.mocked(prisma.orders.findMany);
const mockedUpsert = jest.mocked(prisma.notifications.upsert);
const mockedNotifications = jest.mocked(prisma.notifications.findMany);
const mockedUpdateMany = jest.mocked(prisma.notifications.updateMany);

describe("/api/user/notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUser.mockResolvedValue({
      id: 11,
      name: "Player",
      username: "player",
      email: "player@example.com",
      avatar: "/avatar.png",
      level: 1,
    });
    mockedOrders.mockResolvedValue([]);
    mockedUpsert.mockResolvedValue({} as never);
    mockedNotifications.mockResolvedValue([]);
    mockedUpdateMany.mockResolvedValue({ count: 1 });
  });

  it("returns persisted notifications for the current user", async () => {
    mockedNotifications.mockResolvedValue([
      {
        NotificationID: 5,
        UserID: 11,
        EventKey: "order-created:90",
        Type: "order_created",
        ReferenceID: 90,
        Details: "Pending",
        IsRead: false,
        CreatedAt: new Date("2026-01-01T00:00:00Z"),
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.notifications[0]).toMatchObject({
      id: 5,
      type: "order_created",
      referenceId: 90,
      isRead: false,
    });
  });

  it("marks only the authenticated user's notifications as read", async () => {
    const response = await PATCH();

    expect(response.status).toBe(200);
    expect(mockedUpdateMany).toHaveBeenCalledWith({
      where: { UserID: 11, IsRead: false },
      data: { IsRead: true },
    });
  });

  it("requires authentication", async () => {
    mockedUser.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mockedNotifications).not.toHaveBeenCalled();
  });
});
