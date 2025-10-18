import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";
import z from "zod/v4";
import { db } from "@/db";
import { tagTable } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const { session } = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tags = await unstable_cache(
      async () => db.query.tagTable.findMany(),
      ["api-tags"],
    )();

    return Response.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

const tagsSchema = z.object({
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export async function POST(req: Request) {
  const adminSecret = req.headers.get("x-admin-secret");

  if (!adminSecret || adminSecret !== process.env.API_ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = tagsSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.message || "Invalid input";
      return Response.json({ error: errorMessage }, { status: 400 });
    }

    const tags = await db
      .insert(tagTable)
      .values(result.data.tags.map((tag) => ({ name: tag })))
      .returning();

    return Response.json({ data: tags }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag(s):", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");

  if (!adminSecret || adminSecret !== process.env.API_ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return Response.json({ error: "Tag name is required" }, { status: 400 });
  }

  try {
    await db.delete(tagTable).where(eq(tagTable.name, name));

    return Response.json(
      { message: "Tag deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
