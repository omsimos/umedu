import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const forumTable = sqliteTable("forum", {
  id: text("id").primaryKey(),
});

export const postTable = sqliteTable("post", {
  id: text("id").primaryKey(),
  // for anonymity, user is not referenced
  forumId: text("forum_id")
    .notNull()
    .references(() => forumTable.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  authId: text("auth_id").notNull(),
  forumId: text("forum_id")
    .notNull()
    .references(() => forumTable.id),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type User = typeof userTable.$inferSelect;
export type Forum = typeof forumTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
