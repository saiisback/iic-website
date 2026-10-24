import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

async function applyMigration() {
  const localEnv = resolve(".env.local");
  if (existsSync(localEnv)) {
    process.loadEnvFile(localEnv);
  }
  if (!process.env.DATABASE_URL) {
    const fallbackEnv = resolve(".env");
    if (existsSync(fallbackEnv)) {
      process.loadEnvFile(fallbackEnv);
    }
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Add it to .env.local (for example: DATABASE_URL=postgresql://...) and run again.",
    );
  }

  const migration = await readFile(
    resolve("db/migrations/003_create_application_reviews.sql"),
    "utf8",
  );
  const statements = migration
    .split(/\r?\n-- migrate:split\r?\n/)
    .map((statement) => statement.trim())
    .filter(Boolean);
  const sql = neon(connectionString);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

try {
  await applyMigration();
  console.log("Applied application_reviews migration.");
} catch (error) {
  console.error("Unable to apply application_reviews migration.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
