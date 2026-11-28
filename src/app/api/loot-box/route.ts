import { randomInt } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LOOT_BOX_REWARDS } from "@/lib/loot-box-rewards";

function getUtcDrawDate(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function serializeClaim(claim: {
  ClaimID: number;
  RewardKey: string;
  CreatedAt: Date;
}) {
  return {
    id: claim.ClaimID,
    rewardKey: claim.RewardKey,
    createdAt: claim.CreatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const drawDate = getUtcDrawDate(new Date());
    const [todayClaim, claims] = await Promise.all([
      prisma.lootBoxClaims.findUnique({
        where: { UserID_DrawDate: { UserID: user.id, DrawDate: drawDate } },
      }),
      prisma.lootBoxClaims.findMany({
        where: { UserID: user.id },
        orderBy: { CreatedAt: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      todayClaim: todayClaim ? serializeClaim(todayClaim) : null,
      history: claims.map(serializeClaim),
    });
  } catch (error) {
    console.error("Fetch loot box history error:", error);
    return NextResponse.json(
      { error: "LOOT_BOX_HISTORY_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const drawDate = getUtcDrawDate(new Date());
    const existingClaim = await prisma.lootBoxClaims.findUnique({
      where: { UserID_DrawDate: { UserID: user.id, DrawDate: drawDate } },
    });
    if (existingClaim) {
      return NextResponse.json(
        {
          error: "DAILY_LIMIT_REACHED",
          claim: serializeClaim(existingClaim),
        },
        { status: 409 },
      );
    }

    const reward =
      LOOT_BOX_REWARDS[randomInt(LOOT_BOX_REWARDS.length)];
    try {
      const claim = await prisma.lootBoxClaims.create({
        data: {
          UserID: user.id,
          RewardKey: reward.key,
          DrawDate: drawDate,
        },
      });

      return NextResponse.json({ claim: serializeClaim(claim) }, { status: 201 });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const concurrentClaim = await prisma.lootBoxClaims.findUnique({
          where: { UserID_DrawDate: { UserID: user.id, DrawDate: drawDate } },
        });
        if (concurrentClaim) {
          return NextResponse.json(
            {
              error: "DAILY_LIMIT_REACHED",
              claim: serializeClaim(concurrentClaim),
            },
            { status: 409 },
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("Open loot box error:", error);
    return NextResponse.json({ error: "LOOT_BOX_FAILED" }, { status: 500 });
  }
}
