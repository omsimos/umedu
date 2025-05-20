import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const forumTable = sqliteTable("forum", {
  id: text("id").primaryKey(),
});

export const tagTable = sqliteTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const tagRelation = relations(tagTable, ({ many }) => ({
  posts: many(postTable),
}));

export const postTable = sqliteTable("post", {
  id: text("id").primaryKey(),
  forumId: text("forum_id")
    .notNull()
    .references(() => forumTable.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
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
