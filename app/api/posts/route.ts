import { db } from "@/db";
import { postTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const data = await db.query.postTable.findMany({
    orderBy: [desc(postTable.createdAt)],
  });
  return Response.json(data);
}
