import { drizzle } from "drizzle-orm/libsql";
import { seed, reset } from "drizzle-seed";
import * as schema from "./db/schema";
import { AVAILABLE_TAGS } from "./lib/constants";

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });

  await reset(db, schema);

  await seed(db, {
    forum: schema.forumTable,
    post: schema.postTable,
    tag: schema.tagTable,
  }).refine((f) => ({
    forum: {
      count: 1,
      columns: {
        id: f.valuesFromArray({ values: ["gmail.com"] }),
      },
    },
    tag: {
      count: AVAILABLE_TAGS.length,
      columns: {
        name: f.valuesFromArray({
          values: AVAILABLE_TAGS,
          isUnique: true,
        }),
      },
    },
    post: {
      count: 30,
      columns: {
        title: f.loremIpsum({ sentencesCount: 1 }),
        content: f.loremIpsum({ sentencesCount: 3 }),
      },
    },
  }));

  console.log("✅ Seed complete");
}

main().catch(console.error);
