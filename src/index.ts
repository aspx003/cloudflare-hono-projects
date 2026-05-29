import { serve } from "@hono/node-server";
import { Hono } from "hono";
import tasksRoute from "./routes/tasks.js";
import { env } from "./env/env.js";

const app = new Hono();

app.route("/tasks", tasksRoute);

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
