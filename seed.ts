import { seed } from "drizzle-seed";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

async function main() {
  await seed(db, schema, { count: 30 });
}

main();
