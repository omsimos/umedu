import { db } from "@/db";
import { Post, postTable, Tag } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id),
      with: {
        tagsToPosts: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const { tagsToPosts, ...rest } = post;

    const postData: Post & { tags: Tag[] } = {
      ...rest,
      tags: tagsToPosts.map((t) => t.tag),
    };

    return Response.json(postData);
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
