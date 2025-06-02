import { db } from "@/db";
import { desc, lt, and, or, eq } from "drizzle-orm";
import { postTable } from "@/db/schema";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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
    .where(cursorCondition)
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
