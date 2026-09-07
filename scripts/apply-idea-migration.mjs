import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

async function applyMigration() {
  if (existsSync(resolve(".env.local"))) {
    process.loadEnvFile(resolve(".env.local"));
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing database URL");

  const migration = await readFile(
    resolve("db/migrations/001_create_idea_submissions.sql"),
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
  console.log("Applied idea_submissions migration.");
} catch {
  console.error("Unable to apply idea_submissions migration.");
  process.exitCode = 1;
}
