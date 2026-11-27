/** @jest-environment node */

import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "./route";

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    supportTickets: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockedUser = jest.mocked(getAuthenticatedUser);
const mockedFindMany = jest.mocked(prisma.supportTickets.findMany);
const mockedCreate = jest.mocked(prisma.supportTickets.create);

describe("/api/user/support-tickets", () => {
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
  });

  it("only lists tickets owned by the authenticated account", async () => {
    mockedFindMany.mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(mockedFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserID: 11 } }),
    );
  });

  it("stores a validated ticket for the authenticated account", async () => {
    mockedCreate.mockResolvedValue({
      TicketID: 4,
      Subject: "Order issue",
      Category: "order",
      Status: "Open",
      CreatedAt: new Date("2026-01-01T00:00:00Z"),
    } as never);
    const request = new Request("http://localhost/api/user/support-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Order issue",
        category: "order",
        message: "I need help with my order.",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.ticket).toMatchObject({ id: 4, subject: "Order issue" });
    expect(mockedCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ UserID: 11 }),
      }),
    );
  });
});
