import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../database/db.js";
import { tasksTable } from "../database/schema.js";
import { eq } from "drizzle-orm";

const app = new Hono();

async function getTask(id: number) {
	const task = await db
		.select()
		.from(tasksTable)
		.where(eq(tasksTable.id, id))
		.limit(1);

	if (!task) {
		throw new Error("Task not found");
	}

	return task;
}

const CreateTaskSchema = z.object({
	taskName: z.string(),
	taskDetail: z.string(),
});

app.post("/", zValidator("json", CreateTaskSchema), async (c) => {
	const validated = c.req.valid("json");

	const newTask = await db
		.insert(tasksTable)
		.values({
			...validated,
		})
		.returning();

	return c.json({ task: newTask }, 201);
});

app.get("/", async (c) => {
	const tasks = await db.select({
		taskName: tasksTable.taskName,
		isCompleted: tasksTable.isCompleted,
	}).from(tasksTable);

	return c.json({ tasks });
});

app.get("/:id", async (c) => {
	const { id } = c.req.param();

	try {
		const task = await getTask(parseInt(id));

		return c.json({ task });
	} catch (error) {
		return c.json({ message: "Task not found" }, 404);
	}
});

app.delete("/:id", async (c) => {
	const { id } = c.req.param();

	try {
		const task = await getTask(parseInt(id));

		if (!task) {
			c.json({ message: "Task not found!" });
		}

		await db.delete(tasksTable).where(eq(tasksTable.id, parseInt(id)));

		return c.json({ message: "Task deleted successfully", deletedId: task.id });
	} catch (error) {
		return c.json({ message: "Task not found" }, 404);
	}
});

app.patch("/:id/complete", async (c) => {
	const { id } = c.req.param();

	try {
		const task = await getTask(parseInt(id));
		await db
			.update(tasksTable)
			.set({ isCompleted: 1 })
			.where(eq(tasksTable.id, parseInt(id)));

		return c.json({ task });
	} catch (error) {
		return c.json({ message: "Task not found" }, 404);
	}
});

export default app;
