CREATE TABLE `forum` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_id` text NOT NULL,
	`forum_id` text NOT NULL,
	FOREIGN KEY (`forum_id`) REFERENCES `forum`(`id`) ON UPDATE no action ON DELETE no action
);
