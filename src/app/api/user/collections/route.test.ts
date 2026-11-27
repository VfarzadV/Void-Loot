/** @jest-environment node */

import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, PUT } from "./route";

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    products: {
      findMany: jest.fn(),
    },
    userCartItems: {
      findMany: jest.fn(),
    },
    userWishlistItems: {
      findMany: jest.fn(),
    },
  },
}));

const mockedGetAuthenticatedUser = jest.mocked(getAuthenticatedUser);
const mockedTransaction = jest.mocked(prisma.$transaction);
const mockedProductsFindMany = jest.mocked(prisma.products.findMany);
const mockedCartFindMany = jest.mocked(prisma.userCartItems.findMany);
const mockedWishlistFindMany = jest.mocked(prisma.userWishlistItems.findMany);

type CartRowWithProduct = Prisma.UserCartItemsGetPayload<{
  include: {
    Products: {
      select: {
        ProductID: true;
        Title: true;
        Price: true;
        ImageUrl: true;
      };
    };
  };
}>;

const transactionClient = {
  userCartItems: {
    deleteMany: jest.fn(),
    create: jest.fn(),
  },
  userWishlistItems: {
    deleteMany: jest.fn(),
    create: jest.fn(),
  },
} as unknown as Prisma.TransactionClient;

function createRequest(method: "GET" | "PUT", body?: unknown) {
  return new Request("http://localhost/api/user/collections", {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
}

describe("/api/user/collections", () => {
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
    const cartRows: CartRowWithProduct[] = [
      {
        UserID: 42,
        ProductID: 7,
        Quantity: 2,
        AddedAt: new Date(),
        Products: {
          ProductID: 7,
          Title: "Database Game",
          Price: new Prisma.Decimal("10.00"),
          ImageUrl: "/game.png",
        },
      },
    ];
    mockedCartFindMany.mockResolvedValue(cartRows);
    mockedWishlistFindMany.mockResolvedValue([]);
    mockedProductsFindMany.mockResolvedValue([
      {
        ProductID: 7,
        Title: "Database Game",
        Price: new Prisma.Decimal("10.00"),
        Stock: 4,
        Category: null,
        ImageUrl: "/game.png",
        BrandID: null,
        Description: null,
        HeroImage: null,
        Metacritic: null,
        ReleaseYear: null,
        Genre: null,
      },
      {
        ProductID: 9,
        Title: "Wishlist Game",
        Price: new Prisma.Decimal("5.00"),
        Stock: 2,
        Category: null,
        ImageUrl: null,
        BrandID: null,
        Description: null,
        HeroImage: null,
        Metacritic: null,
        ReleaseYear: null,
        Genre: null,
      },
    ]);
    transactionClient.userCartItems.deleteMany = jest
      .fn()
      .mockResolvedValue({ count: 0 });
    transactionClient.userCartItems.create = jest.fn().mockResolvedValue({});
    transactionClient.userWishlistItems.deleteMany = jest
      .fn()
      .mockResolvedValue({ count: 0 });
    transactionClient.userWishlistItems.create = jest.fn().mockResolvedValue({});
    mockedTransaction.mockImplementation(async (callback) =>
      callback(transactionClient),
    );
  });

  it("loads the signed-in user's cart and wishlist from the database", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      cart: [
        {
          id: 7,
          title: "Database Game",
          price: 10,
          image: "/game.png",
          quantity: 2,
        },
      ],
      wishlist: [],
    });
    expect(mockedCartFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserID: 42 } }),
    );
  });

  it("filters deleted products and replaces both collections transactionally", async () => {
    mockedCartFindMany.mockResolvedValue([]);
    mockedWishlistFindMany.mockResolvedValue([]);

    const response = await PUT(
      createRequest("PUT", {
        cart: [
          { id: 7, quantity: 2 },
          { id: 8, quantity: 1 },
        ],
        wishlist: [7, 9],
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unavailableProductIds).toEqual([8]);
    expect(mockedTransaction).toHaveBeenCalledTimes(1);
    expect(transactionClient.userCartItems.create).toHaveBeenCalledWith({
      data: { UserID: 42, ProductID: 7, Quantity: 2 },
    });
    expect(transactionClient.userCartItems.create).toHaveBeenCalledTimes(1);
    expect(transactionClient.userWishlistItems.create).toHaveBeenCalledTimes(2);
  });

  it("rejects duplicate cart products without writing to the database", async () => {
    const response = await PUT(
      createRequest("PUT", {
        cart: [
          { id: 7, quantity: 1 },
          { id: 7, quantity: 2 },
        ],
        wishlist: [],
      }),
    );

    expect(response.status).toBe(400);
    expect(mockedTransaction).not.toHaveBeenCalled();
  });

  it("requires authentication", async () => {
    mockedGetAuthenticatedUser.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mockedCartFindMany).not.toHaveBeenCalled();
  });
});
