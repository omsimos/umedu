"use server";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function addPost({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const { session } = await getSession();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db.insert(postTable).values({
      title,
      content,
      forumId: session.forumId,
    });
  } catch (error) {
    console.log("Error sending message:", error);
    return { error: "Internal server error" };
  }
}
