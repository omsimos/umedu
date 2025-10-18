import { exec as _exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/libsql";
import { seed } from "drizzle-seed";
import * as schema from "../db/schema";
import { aesEncrypt } from "../lib/aes";
import { AVAILABLE_TAGS } from "../lib/constants";

const exec = promisify(_exec);

async function cleanupLocalDbFiles() {
  const cwd = process.cwd();
  console.log("🧹 Cleaning up local.db* files in", cwd);
  const files = await fs.readdir(cwd);
  const toDelete = files.filter((f) => f.startsWith("local.db"));
  await Promise.all(
    toDelete.map(async (name) => {
      const full = path.resolve(cwd, name);
      try {
        await fs.unlink(full);
        console.log("✅ Deleted", name);
        // biome-ignore lint/suspicious/noExplicitAny: temp
      } catch (err: any) {
        if (err.code === "ENOENT") {
          console.log("! File not found (skipping):", name);
        } else {
          console.warn("! Failed to delete", name, "→", err.message);
        }
      }
    }),
  );
  if (toDelete.length === 0) {
    console.log("i No local.db* files found");
  }
}

async function runMigrations() {
  console.log("🚀 Running migrations via bun…");
  try {
    const { stdout, stderr } = await exec("bun drizzle-kit migrate");
    if (stderr) {
      console.error("🔴 Migration stderr:", stderr);
      throw new Error("Migration failed");
    }
    console.log("📦 Migration output:", stdout);
    // biome-ignore lint/suspicious/noExplicitAny: temp
  } catch (err: any) {
    console.error("❌ Unable to run migrations:", err.message);
    process.exit(1);
  }
}

async function main() {
  await cleanupLocalDbFiles();
  await runMigrations();

  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL ?? "",
      authToken: process.env.TURSO_AUTH_TOKEN ?? "",
    },
  });

  await seed(db, { forum: schema.forumTable, tag: schema.tagTable }).refine(
    (f) => ({
      forum: {
        count: 1,
        columns: { id: f.valuesFromArray({ values: ["gmail.com"] }) },
      },
      tag: {
        count: AVAILABLE_TAGS.length,
        columns: {
          name: f.valuesFromArray({ values: AVAILABLE_TAGS, isUnique: true }),
        },
      },
    }),
  );

  const forum = await db
    .select({ id: schema.forumTable.id })
    .from(schema.forumTable)
    .then((r) => r[0]);
  const tagIds = (
    await db.select({ id: schema.tagTable.id }).from(schema.tagTable)
  ).map((r) => r.id);

  const posts = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const titlePlain = faker.lorem.sentence();
      const contentPlain = faker.lorem.paragraphs(1);
      return {
        forumId: forum.id,
        title: await aesEncrypt(titlePlain),
        content: await aesEncrypt(contentPlain),
        tagId: tagIds[Math.floor(Math.random() * tagIds.length)],
      };
    }),
  );

  await db.insert(schema.postTable).values(posts);

  console.log("✅ Seed complete (encrypted posts inserted)");
}

main().catch((err) => {
  console.error("Unhandled error in seed script:", err);
  process.exit(1);
});
