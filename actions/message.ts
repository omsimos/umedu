"use server";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function submitPost({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const { session } = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await db.insert(postTable).values({
      title,
      content,
      forumId: session.forumId,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}
