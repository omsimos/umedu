import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

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
  tags: many(postsToTags),
}));

export const tagTable = sqliteTable("tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),
});

export const tagsRelations = relations(tagTable, ({ many }) => ({
  posts: many(postsToTags),
}));

export const postsToTags = sqliteTable(
  "posts_to_tags",
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

export const postToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(postTable, {
    fields: [postsToTags.postId],
    references: [postTable.id],
  }),
  tag: one(tagTable, {
    fields: [postsToTags.tagId],
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
export type Forum = typeof forumTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
