import type { NextRequest } from "next/server";
import { desc, lt, and, or, eq } from "drizzle-orm";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { session } = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");

  let cursorCondition;

  if (cursor) {
    const [createdAt, cursorId] = cursor.split("_");
    const cursorDate = Number.parseInt(createdAt);

    cursorCondition = or(
      lt(postTable.createdAt, cursorDate),
      and(eq(postTable.createdAt, cursorDate), lt(postTable.id, cursorId)),
    );
  }

  const posts = await db
    .select()
    .from(postTable)
    .where(and(cursorCondition, eq(postTable.forumId, session?.forumId)))
    .limit(10)
    .orderBy(desc(postTable.createdAt), desc(postTable.id));

  return Response.json({
    posts,
    nextCursor:
      posts.length === 10
        ? `${posts[posts.length - 1].createdAt}_${posts[posts.length - 1].id}`
        : null,
  });
}
