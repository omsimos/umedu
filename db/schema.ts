import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const channelTable = sqliteTable("channel", {
  id: text("id").primaryKey(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  channelId: text("channel_id")
    .notNull()
    .references(() => channelTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type Channel = typeof channelTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
