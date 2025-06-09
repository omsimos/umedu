import { z } from "zod";

import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { postTable } from "@/db/schema";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content } = postSchema.parse(body);

  const { session } = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.insert(postTable).values({
      title,
      content,
      forumId: session.forumId,
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
