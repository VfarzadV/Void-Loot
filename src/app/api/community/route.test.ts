/** @jest-environment node */

import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { POST as createPost, GET as getPosts } from "./posts/route";
import { POST as createComment } from "./comments/route";
import { POST as toggleLike } from "./likes/route";

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    communityPosts: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    communityComments: { create: jest.fn() },
    communityPostLikes: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockedUser = jest.mocked(getAuthenticatedUser);
const mockedFindPosts = jest.mocked(prisma.communityPosts.findMany);
const mockedCreatePost = jest.mocked(prisma.communityPosts.create);
const mockedFindPost = jest.mocked(prisma.communityPosts.findUnique);
const mockedCreateComment = jest.mocked(prisma.communityComments.create);
const mockedFindLike = jest.mocked(prisma.communityPostLikes.findUnique);
const mockedCreateLike = jest.mocked(prisma.communityPostLikes.create);
const mockedLikeCount = jest.mocked(prisma.communityPostLikes.count);

const testUser = {
  id: 11,
  name: "Player",
  username: "player",
  email: "player@example.com",
  avatar: "/avatar.png",
  level: 1,
};

function request(path: string, body: unknown) {
  return new Request(`http://localhost/api/community/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("community APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUser.mockResolvedValue(testUser);
  });

  it("allows public reading of posts from the database", async () => {
    mockedUser.mockResolvedValue(null);
    mockedFindPosts.mockResolvedValue([
      {
        PostID: 2,
        Title: "Build advice",
        Content: "Which graphics card should I choose?",
        Category: "hardware",
        Tags: '["gpu"]',
        CreatedAt: new Date("2026-01-01T00:00:00Z"),
        Users: {
          Username: "player",
          Profile: { DisplayName: "Player", AvatarUrl: null },
        },
        _count: { Comments: 3, Likes: 4 },
        Likes: [],
      },
    ] as never);

    const response = await getPosts(
      new Request("http://localhost/api/community/posts"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.posts[0]).toMatchObject({
      id: 2,
      author: "Player",
      tags: ["gpu"],
      likes: 4,
      commentsCount: 3,
      likedByMe: false,
    });
  });

  it("stores posts under the authenticated account", async () => {
    mockedCreatePost.mockResolvedValue({
      PostID: 3,
      Title: "New build",
      Content: "Sharing my setup details here.",
      Category: "hardware",
      Tags: "[]",
      CreatedAt: new Date("2026-01-01T00:00:00Z"),
      Users: {
        Username: "player",
        Profile: { DisplayName: "Player", AvatarUrl: null },
      },
      _count: { Comments: 0, Likes: 0 },
      Likes: [],
    } as never);

    const response = await createPost(
      request("posts", {
        title: "New build",
        content: "Sharing my setup details here.",
        category: "hardware",
        tags: ["pc"],
      }),
    );

    expect(response.status).toBe(201);
    expect(mockedCreatePost).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ UserID: testUser.id }),
      }),
    );
  });

  it("persists likes for the authenticated user", async () => {
    mockedFindPost.mockResolvedValue({ PostID: 3 } as never);
    mockedFindLike.mockResolvedValue(null);
    mockedCreateLike.mockResolvedValue({} as never);
    mockedLikeCount.mockResolvedValue(1);

    const response = await toggleLike(request("likes", { postId: 3 }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ liked: true, likes: 1 });
    expect(mockedCreateLike).toHaveBeenCalledWith({
      data: { PostID: 3, UserID: testUser.id },
    });
  });

  it("persists comments for the authenticated user", async () => {
    mockedFindPost.mockResolvedValue({ PostID: 3 } as never);
    mockedCreateComment.mockResolvedValue({
      CommentID: 8,
      Content: "Looks great!",
      CreatedAt: new Date("2026-01-01T00:00:00Z"),
      Users: {
        Username: "player",
        Profile: { DisplayName: "Player", AvatarUrl: null },
      },
    } as never);

    const response = await createComment(
      request("comments", { postId: 3, content: "Looks great!" }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.comment).toMatchObject({
      id: 8,
      content: "Looks great!",
      author: "Player",
    });
  });
});
