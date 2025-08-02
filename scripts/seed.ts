// scripts/seed.ts
import { drizzle } from "drizzle-orm/libsql";
import { seed } from "drizzle-seed";
import * as schema from "../db/schema";
import { AVAILABLE_TAGS } from "../lib/constants";
import { aesEncrypt } from "../lib/aes";
import { faker } from "@faker-js/faker";

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });

  // await reset(db, schema);
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

main().catch(console.error);
