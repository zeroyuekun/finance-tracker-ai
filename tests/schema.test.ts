import { describe, expect, it } from "vitest";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const hasNeonUrl = process.env.DATABASE_URL?.includes("neon.tech") ?? false;

describe.skipIf(!hasNeonUrl)("auth schema", () => {
  it("required tables exist", async () => {
    const sql = neon(process.env.DATABASE_URL as string);
    const rows = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    const names = rows.map((r) => r.table_name as string);
    expect(names).toContain("user");
    expect(names).toContain("account");
    expect(names).toContain("session");
    expect(names).toContain("verificationToken");
  });
});
