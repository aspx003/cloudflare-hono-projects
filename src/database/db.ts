import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from "../env/env.js";

export const db = drizzle(env.DATABASE);