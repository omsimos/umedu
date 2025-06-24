ALTER TABLE `posts_to_tags` RENAME TO `tags_to_posts`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tags_to_posts` (
	`post_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tags_to_posts`("post_id", "tag_id") SELECT "post_id", "tag_id" FROM `tags_to_posts`;--> statement-breakpoint
DROP TABLE `tags_to_posts`;--> statement-breakpoint
ALTER TABLE `__new_tags_to_posts` RENAME TO `tags_to_posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;