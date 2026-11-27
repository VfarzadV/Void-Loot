/** @jest-environment node */

import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "./route";

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    products: {
      findMany: jest.fn(),
    },
  },
}));

const mockedGetAuthenticatedUser = jest.mocked(getAuthenticatedUser);
const mockedTransaction = jest.mocked(prisma.$transaction);
const mockedProductsFindMany = jest.mocked(prisma.products.findMany);

const transactionClient = {
  products: {
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  orders: {
    create: jest.fn(),
  },
  orderItems: {
    create: jest.fn(),
  },
  notifications: {
    create: jest.fn(),
  },
} as unknown as Prisma.TransactionClient;

function createRequest(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAuthenticatedUser.mockResolvedValue({
      id: 42,
      name: "Test User",
      username: "test-user",
      email: "test@example.com",
      avatar: "/avatar.png",
      level: 1,
    });
    mockedProductsFindMany.mockResolvedValue([
      {
        ProductID: 7,
        Title: "Database Game",
        Price: new Prisma.Decimal("10.00"),
        Category: "games",
        ImageUrl: "/game.png",
        Stock: 4,
        BrandID: null,
        Description: null,
        HeroImage: null,
        Metacritic: null,
        ReleaseYear: null,
        Genre: null,
      },
    ]);

    transactionClient.products.findMany = jest.fn().mockResolvedValue([
      {
        ProductID: 7,
        Title: "Database Game",
        Price: new Prisma.Decimal("10.00"),
        ImageUrl: "/game.png",
        Stock: 4,
      },
    ]);
    transactionClient.products.updateMany = jest
      .fn()
      .mockResolvedValue({ count: 1 });
    transactionClient.orders.create = jest
      .fn()
      .mockResolvedValue({ OrderID: 123 });
    transactionClient.orderItems.create = jest.fn().mockResolvedValue({});
    transactionClient.notifications.create = jest.fn().mockResolvedValue({});
    mockedTransaction.mockImplementation(async (callback) =>
      callback(transactionClient),
    );
  });

  it("returns current product prices from the database for the quote", async () => {
    const request = new Request(
      `http://localhost/api/checkout?items=${encodeURIComponent(
        JSON.stringify([{ id: 7, quantity: 1 }]),
      )}`,
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.quote).toMatchObject({
      items: [
        {
          id: 7,
          title: "Database Game",
          price: "10.00",
          quantity: 1,
          lineTotal: "10.00",
        },
      ],
      subtotal: "10.00",
      tax: "0.50",
      total: "10.50",
    });
  });

  it("requires an authenticated account", async () => {
    mockedGetAuthenticatedUser.mockResolvedValue(null);

    const response = await POST(
      createRequest({ items: [{ id: 7, quantity: 1 }], expectedTotal: "10.50" }),
    );

    expect(response.status).toBe(401);
    expect(mockedTransaction).not.toHaveBeenCalled();
  });

  it("uses database prices and the session user when recording an order", async () => {
    const response = await POST(
      createRequest({
        items: [{ id: 7, quantity: 2, price: 0 }],
        expectedTotal: "21.00",
        total: 0,
        userInfo: { email: "someone-else@example.com" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      orderId: "VOID-123",
      total: "21.00",
      status: "Pending",
    });
    expect(transactionClient.orders.create).toHaveBeenCalledWith({
      data: {
        UserID: 42,
        TotalAmount: new Prisma.Decimal("21.00"),
        Status: "Pending",
      },
    });
    expect(transactionClient.orderItems.create).toHaveBeenCalledWith({
      data: {
        OrderID: 123,
        ProductID: 7,
        Quantity: 2,
        UnitPrice: new Prisma.Decimal("10.00"),
      },
    });
    expect(transactionClient.products.updateMany).toHaveBeenCalledWith({
      where: { ProductID: 7, Stock: { gte: 2 } },
      data: { Stock: { decrement: 2 } },
    });
    expect(transactionClient.notifications.create).toHaveBeenCalledWith({
      data: {
        UserID: 42,
        EventKey: "order-created:123",
        Type: "order_created",
        ReferenceID: 123,
        Details: "Pending",
      },
    });
  });

  it("does not create an order if the quoted total has changed", async () => {
    const response = await POST(
      createRequest({
        items: [{ id: 7, quantity: 1 }],
        expectedTotal: "5.00",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toMatchObject({
      error: "PRICE_CHANGED",
      quote: { total: "10.50" },
    });
    expect(transactionClient.orders.create).not.toHaveBeenCalled();
  });

  it("does not create an order when stock is insufficient", async () => {
    transactionClient.products.findMany = jest.fn().mockResolvedValue([
      {
        ProductID: 7,
        Title: "Database Game",
        Price: new Prisma.Decimal("10.00"),
        ImageUrl: "/game.png",
        Stock: 1,
      },
    ]);

    const response = await POST(
      createRequest({
        items: [{ id: 7, quantity: 2 }],
        expectedTotal: "21.00",
      }),
    );

    expect(response.status).toBe(409);
    expect(transactionClient.orders.create).not.toHaveBeenCalled();
    expect(transactionClient.products.updateMany).not.toHaveBeenCalled();
  });
});
