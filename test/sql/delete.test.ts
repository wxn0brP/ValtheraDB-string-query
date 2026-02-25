import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - DELETE", () => {
	test("1. should parse a simple DELETE query", () => {
		const query = "DELETE FROM users WHERE id = 1";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove"); // DELETE maps to "remove" method
		expect(parsedQuery.query.collection).toBe("users"); // collection name
		expect(parsedQuery.query.search).toEqual({ id: 1 }); // where clause
	});

	test("2. should parse DELETE query without WHERE clause", () => {
		const query = "DELETE FROM users";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("users"); // collection name
		expect(parsedQuery.query.search).toEqual({}); // empty where clause
	});

	test("3. should parse DELETE with complex WHERE conditions", () => {
		const query = "DELETE FROM users WHERE age > 65 AND status = 'inactive'";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("users"); // collection name
		expect(parsedQuery.query.search).toEqual({ $gt: { age: 65 }, status: "inactive" }); // where clause
	});

	test("4. should parse DELETE with string values", () => {
		const query = "DELETE FROM posts WHERE title = 'Unwanted Post'";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("posts"); // collection name
		expect(parsedQuery.query.search).toEqual({ title: "Unwanted Post" }); // where clause
	});

	test("5. should parse DELETE with numeric values", () => {
		const query = "DELETE FROM products WHERE price = 0";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("products"); // collection name
		expect(parsedQuery.query.search).toEqual({ price: 0 }); // where clause
	});

	test("6. should throw error for invalid DELETE syntax", () => {
		const query = "DELETE users WHERE id = 1"; // missing FROM keyword

		expect(() => {
			sqlParser.parse(query);
		}).toThrow("Invalid DELETE syntax");
	});

	test("7. should parse DELETE with quoted string values", () => {
		const query = "DELETE FROM users WHERE name = 'John Doe'";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("users"); // collection name
		expect(parsedQuery.query.search).toEqual({ name: "John Doe" }); // where clause
	});

	test("8. should handle DELETE with multiple condition types", () => {
		const query = "DELETE FROM orders WHERE total > 1000 AND status = 'cancelled' AND user_id != 5";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("remove");
		expect(parsedQuery.query.collection).toBe("orders"); // collection name
		expect(parsedQuery.query.search).toEqual({
			$gt: { total: 1000 },
			status: "cancelled",
			$not: { user_id: 5 }
		}); // where clause with multiple operators
	});
});
