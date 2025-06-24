import { z } from "zod/v4";
import type { NextRequest } from "next/server";
import { desc, lt, and, or, eq } from "drizzle-orm";

import { db } from "@/db";
import { tagsToPostsTable, postTable, Post, Tag } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { session } = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");

    let cursorCondition;

    if (cursor) {
      const [createdAt, cursorId] = cursor.split("_");
      const cursorDate = new Date(createdAt);

      cursorCondition = or(
        lt(postTable.createdAt, cursorDate),
        and(eq(postTable.createdAt, cursorDate), lt(postTable.id, cursorId)),
      );
    }

    const posts = await db.query.postTable.findMany({
      with: {
        tagsToPosts: {
          with: {
            tag: true,
          },
        },
      },
      where: and(cursorCondition, eq(postTable.forumId, session?.forumId)),
      orderBy: [desc(postTable.createdAt), desc(postTable.id)],
      limit: 10,
    });

    const postsData: (Post & { tags: Tag[] })[] = posts.map((post) => ({
      id: post.id,
      forumId: post.forumId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.tagsToPosts.map((t) => t.tag),
    }));

    return Response.json({
      posts: postsData,
      nextCursor:
        posts.length === 10
          ? `${posts[posts.length - 1].createdAt}_${posts[posts.length - 1].id}`
          : null,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).max(3, {
    error: "You can select up to 3 tags",
  }),
});

export async function POST(req: Request) {
  try {
    const { session } = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const params = postSchema.safeParse(body);

    if (!params.success) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, content, tags } = params.data;

    await db.transaction(async (tx) => {
      const post = await tx
        .insert(postTable)
        .values({
          title,
          content,
          forumId: session.forumId,
        })
        .returning({ id: postTable.id });

      await tx
        .insert(tagsToPostsTable)
        .values(tags.map((tag) => ({ postId: post[0].id, tagId: tag })));
    });

    return Response.json(
      { message: "Post added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
