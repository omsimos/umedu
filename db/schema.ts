import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const forumTable = sqliteTable("forum", {
  id: text("id").primaryKey(),
});

export const postTable = sqliteTable(
  "post",
  {
    id: text().$defaultFn(() => nanoid()),
    forumId: text("forum_id")
      .notNull()
      .references(() => forumTable.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => sql`(unixepoch())`,
    ),
  },
  (table) => [
    index("post_forum_created_id_idx").on(
      table.forumId,
      table.createdAt,
      table.id,
    ),
  ],
);

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  forumId: text("forum_id")
    .notNull()
    .references(() => forumTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type Post = typeof postTable.$inferSelect;
export type Forum = typeof forumTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
