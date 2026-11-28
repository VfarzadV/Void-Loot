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
    lootBoxClaims: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockedUser = jest.mocked(getAuthenticatedUser);
const mockedFindUnique = jest.mocked(prisma.lootBoxClaims.findUnique);
const mockedFindMany = jest.mocked(prisma.lootBoxClaims.findMany);
const mockedCreate = jest.mocked(prisma.lootBoxClaims.create);

describe("/api/loot-box", () => {
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
    mockedFindUnique.mockResolvedValue(null);
    mockedFindMany.mockResolvedValue([]);
    mockedCreate.mockResolvedValue({
      ClaimID: 8,
      UserID: 11,
      RewardKey: "cyberpunk-key",
      DrawDate: new Date("2026-11-28T00:00:00.000Z"),
      CreatedAt: new Date("2026-11-28T08:30:00.000Z"),
    });
  });

  it("requires authentication to read history", async () => {
    mockedUser.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mockedFindMany).not.toHaveBeenCalled();
  });

  it("returns the authenticated user's history", async () => {
    mockedFindMany.mockResolvedValue([
      {
        ClaimID: 8,
        UserID: 11,
        RewardKey: "cyberpunk-key",
        DrawDate: new Date("2026-11-28T00:00:00.000Z"),
        CreatedAt: new Date("2026-11-28T08:30:00.000Z"),
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.history).toEqual([
      {
        id: 8,
        rewardKey: "cyberpunk-key",
        createdAt: "2026-11-28T08:30:00.000Z",
      },
    ]);
  });

  it("persists one randomly selected reward for the current UTC day", async () => {
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.claim).toMatchObject({
      id: 8,
      rewardKey: "cyberpunk-key",
    });
    expect(mockedCreate).toHaveBeenCalledWith({
      data: {
        UserID: 11,
        RewardKey: expect.any(String),
        DrawDate: expect.any(Date),
      },
    });
  });

  it("requires authentication to open a loot box", async () => {
    mockedUser.mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns the existing daily reward without drawing again", async () => {
    mockedFindUnique.mockResolvedValue({
      ClaimID: 8,
      UserID: 11,
      RewardKey: "cyberpunk-key",
      DrawDate: new Date("2026-11-28T00:00:00.000Z"),
      CreatedAt: new Date("2026-11-28T08:30:00.000Z"),
    });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("DAILY_LIMIT_REACHED");
    expect(body.claim.id).toBe(8);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("handles simultaneous daily draws without creating a second reward", async () => {
    const existingClaim = {
      ClaimID: 8,
      UserID: 11,
      RewardKey: "cyberpunk-key",
      DrawDate: new Date("2026-11-28T00:00:00.000Z"),
      CreatedAt: new Date("2026-11-28T08:30:00.000Z"),
    };
    mockedFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingClaim);
    mockedCreate.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Duplicate daily draw", {
        code: "P2002",
        clientVersion: "5.22.0",
      }),
    );

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("DAILY_LIMIT_REACHED");
    expect(body.claim.id).toBe(existingClaim.ClaimID);
  });
});
