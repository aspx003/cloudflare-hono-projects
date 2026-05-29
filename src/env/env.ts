import * as z from "zod";
import dotenv from "dotenv";

dotenv.config();

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error);

  process.exit(1);
}

export const env = parsed.data;