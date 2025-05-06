import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const forumTable = sqliteTable("forum", {
  id: text("id").primaryKey(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  forumId: text("forum_id")
    .notNull()
    .references(() => forumTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type Forum = typeof forumTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
