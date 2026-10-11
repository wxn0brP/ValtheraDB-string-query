import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - Collections", () => {
	test("1. should parse GET COLLECTIONS", () => {
		const parsedQuery = sqlParser.parse("GET COLLECTIONS");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("getCollections");
	});

	test("2. should parse CREATE TABLE", () => {
		const parsedQuery = sqlParser.parse("CREATE TABLE users");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("ensureCollection");
		expect(parsedQuery.query.collection).toBe("users");
	});

	test("3. should parse CREATE COLLECTION", () => {
		const parsedQuery = sqlParser.parse("CREATE COLLECTION posts");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("ensureCollection");
		expect(parsedQuery.query.collection).toBe("posts");
	});

	test("4. should parse CREATE TABLE IF NOT EXISTS", () => {
		const parsedQuery = sqlParser.parse("CREATE TABLE IF NOT EXISTS users");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("ensureCollection");
		expect(parsedQuery.query.collection).toBe("users");
	});

	test("5. should parse DROP TABLE", () => {
		const parsedQuery = sqlParser.parse("DROP TABLE users");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("removeCollection");
		expect(parsedQuery.query.collection).toBe("users");
	});

	test("6. should parse DROP TABLE IF EXISTS", () => {
		const parsedQuery = sqlParser.parse("DROP TABLE IF EXISTS users");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("removeCollection");
		expect(parsedQuery.query.collection).toBe("users");
	});

	test("7. should parse EXISTS TABLE", () => {
		const parsedQuery = sqlParser.parse("EXISTS TABLE users");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("issetCollection");
		expect(parsedQuery.query.collection).toBe("users");
	});

	test("8. should parse CREATE INDEX", () => {
		const parsedQuery = sqlParser.parse(
			"CREATE INDEX idx_name ON users (email)",
		);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("createIndex");
		expect(parsedQuery.query.collection).toBe("users");
		expect(parsedQuery.query.index).toEqual({
			collection: "users",
			fields: [
				"email",
			],
			opts: {
				unique: false,
				name: "idx_name",
			},
		});
	});

	test("9. should parse CREATE UNIQUE INDEX IF NOT EXISTS with multiple fields", () => {
		const parsedQuery = sqlParser.parse(
			"CREATE UNIQUE INDEX IF NOT EXISTS uq_email_age ON users (email, age)",
		);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("createIndex");
		expect(parsedQuery.query.collection).toBe("users");
		expect(parsedQuery.query.index).toEqual({
			collection: "users",
			fields: [
				"email",
				"age",
			],
			opts: {
				unique: true,
				name: "uq_email_age",
			},
		});
	});

	test("10. should parse CREATE INDEX with backtick-quoted name", () => {
		const parsedQuery = sqlParser.parse(
			"CREATE INDEX `idx_name` ON users (`email`)",
		);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("createIndex");
		expect(parsedQuery.query.index).toEqual({
			collection: "users",
			fields: [
				"email",
			],
			opts: {
				unique: false,
				name: "idx_name",
			},
		});
	});

	test("11. should throw for CREATE INDEX without name", () => {
		expect(() => sqlParser.parse("CREATE INDEX ON users (email)")).toThrow(
			"Invalid CREATE INDEX syntax.",
		);
	});

	test("12. should throw for CREATE INDEX without fields", () => {
		expect(() => sqlParser.parse("CREATE INDEX idx_name ON users")).toThrow(
			"Invalid CREATE INDEX syntax.",
		);
	});

	test("13. should parse DROP INDEX with fields", () => {
		const parsedQuery = sqlParser.parse("DROP INDEX idx_name ON users (email)");

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("removeIndex");
		expect(parsedQuery.query.collection).toBe("users");
		expect(parsedQuery.query.index).toEqual({
			collection: "users",
			fields: [
				"email",
			],
			opts: {
				name: "idx_name",
			},
		});
	});

	test("14. should parse DROP INDEX IF EXISTS with multiple fields", () => {
		const parsedQuery = sqlParser.parse(
			"DROP INDEX IF EXISTS uq_email_age ON users (email, age)",
		);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("removeIndex");
		expect(parsedQuery.query.collection).toBe("users");
		expect(parsedQuery.query.index).toEqual({
			collection: "users",
			fields: [
				"email",
				"age",
			],
			opts: {
				name: "uq_email_age",
			},
		});
	});

	test("15. should throw for DROP INDEX without fields", () => {
		expect(() => sqlParser.parse("DROP INDEX idx_name ON users")).toThrow(
			"Invalid DROP INDEX syntax.",
		);
	});

	test("16. should throw for DROP INDEX with invalid field", () => {
		expect(() => sqlParser.parse("DROP INDEX idx ON users (a b)")).toThrow(
			"Invalid index field 'a b'",
		);
	});

	test("17. should throw for unknown SQL command with suggestion", () => {
		expect(() => sqlParser.parse("SELECTT * FROM users")).toThrow(
			"Unknown SQL command 'SELECTT'. Did you mean 'SELECT'?",
		);
	});
});
