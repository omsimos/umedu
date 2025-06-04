import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { upstashCache } from "drizzle-orm/cache/upstash";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
  cache: upstashCache({
    url: process.env.UPSTASH_URL!,
    token: process.env.UPSTASH_TOKEN!,
    global: true,
    config: { ex: 60 },
  }),
});
