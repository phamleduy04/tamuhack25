import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const reports = sqliteTable("reports", {
	id: text("id").primaryKey(),
	icao24: text("icao24").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	attachedScans: text("attached_scans", { mode: "json" }),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`
	),
	authorId: text("author_id"),
	authorImage: text("author_image"),
	authorName: text("author_name"),
});

export const messages = sqliteTable("messages", {
	id: text("id").primaryKey(),
	reportId: text("report_id").references(() => reports.id),
	message: text("message").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`CURRENT_TIMESTAMP`
	),
});

export const reportsToMessages = sqliteTable("reports_to_messages", {
	reportId: text("report_id")
		.notNull()
		.references(() => reports.id),
	messageId: text("message_id")
		.notNull()
		.references(() => messages.id),
	authorId: text("author_id"),
	authorImage: text("author_image"),
	authorName: text("author_name"),
});
