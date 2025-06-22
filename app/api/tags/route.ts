import { db } from "@/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const { session } = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tags = await db.query.tagTable.findMany();

    return Response.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
