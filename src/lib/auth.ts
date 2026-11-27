import "server-only";

import {
  createHash,
  randomBytes,
} from "node:crypto";
import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "void-loot-session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  level: number;
  joinDate?: string;
}

type UserWithProfile = Prisma.UsersGetPayload<{
  include: { Profile: true };
}>;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.userSessions.deleteMany({
    where: { UserID: userId, ExpiresAt: { lte: new Date() } },
  });
  await prisma.userSessions.create({
    data: {
      SessionID: hashSessionToken(token),
      UserID: userId,
      ExpiresAt: expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function revokeSession(token: string) {
  await prisma.userSessions.deleteMany({
    where: { SessionID: hashSessionToken(token) },
  });
}

export function toAuthUser(user: UserWithProfile): AuthUser {
  return {
    id: user.UserID,
    name: user.Profile?.DisplayName || user.Username,
    username: user.Username,
    email: user.Email,
    avatar: user.Profile?.AvatarUrl || "/android-chrome-192x192.png",
    ...(user.Profile?.BannerUrl ? { banner: user.Profile.BannerUrl } : {}),
    level: user.Profile?.Level ?? 1,
    ...(user.JoinDate ? { joinDate: user.JoinDate.toISOString() } : {}),
  };
}

export async function ensureUserProfile(user: UserWithProfile) {
  const profile = await prisma.userProfiles.upsert({
    where: { UserID: user.UserID },
    update: {},
    create: {
      UserID: user.UserID,
      DisplayName: user.Username,
      AvatarUrl: "/android-chrome-192x192.png",
    },
  });

  return toAuthUser({ ...user, Profile: profile });
}

export async function getAuthenticatedUser() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

  const session = await prisma.userSessions.findUnique({
    where: { SessionID: hashSessionToken(token) },
    include: { Users: { include: { Profile: true } } },
  });

  if (!session) return null;
  if (session.ExpiresAt <= new Date()) {
    await prisma.userSessions.deleteMany({
      where: { SessionID: session.SessionID },
    });
    return null;
  }

  return ensureUserProfile(session.Users);
}
