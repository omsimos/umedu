import { db } from "@/db";

export async function GET() {
  const data = await db.query.postTable.findMany();
  return Response.json(data);
}
