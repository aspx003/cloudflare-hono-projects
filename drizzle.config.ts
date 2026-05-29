import { defineConfig } from 'drizzle-kit';
import {env} from "./src/env/env.js";

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: env.DATABASE,
    },
});
