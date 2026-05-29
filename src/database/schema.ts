import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, sql } from "drizzle-orm";

export const tasksTable = sqliteTable("tasks", {
    id: integer().primaryKey({ autoIncrement: true }),
    taskName: text().notNull(),
    taskDetail: text().notNull(),
    isCompleted: integer().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
});

export type Task = InferSelectModel<typeof tasksTable>