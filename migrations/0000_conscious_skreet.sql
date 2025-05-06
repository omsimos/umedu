CREATE TABLE `forum` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`forum_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`forum_id`) REFERENCES `forum`(`id`) ON UPDATE no action ON DELETE no action
);
