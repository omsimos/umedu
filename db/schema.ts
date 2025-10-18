import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const forumTable = sqliteTable("forum", {
  id: text("id").primaryKey(),
});

export const postTable = sqliteTable(
  "post",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
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
  (t) => [index("post_forum_created_id_idx").on(t.forumId, t.createdAt, t.id)],
);

export const postsRelations = relations(postTable, ({ many }) => ({
  tagsToPosts: many(tagsToPostsTable),
}));

export const tagTable = sqliteTable("tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),
});

export const tagsRelations = relations(tagTable, ({ many }) => ({
  tagsToPosts: many(tagsToPostsTable),
}));

export const tagsToPostsTable = sqliteTable(
  "tags_to_posts",
  {
    postId: text("post_id")
      .notNull()
      .references(() => postTable.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tagTable.id),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const tagsToPostsRelations = relations(tagsToPostsTable, ({ one }) => ({
  post: one(postTable, {
    fields: [tagsToPostsTable.postId],
    references: [postTable.id],
  }),
  tag: one(tagTable, {
    fields: [tagsToPostsTable.tagId],
    references: [tagTable.id],
  }),
}));

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
export type Tag = typeof tagTable.$inferSelect;
export type Forum = typeof forumTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
export type TagsToPosts = typeof tagsToPostsTable.$inferSelect;
