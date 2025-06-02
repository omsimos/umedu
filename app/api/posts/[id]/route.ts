import { db } from "@/db";
import { postTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const post = await db.query.postTable.findFirst({
    where: eq(postTable.id, id),
  });

  return Response.json(post);
}
