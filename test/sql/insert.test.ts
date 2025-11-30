import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - INSERT", () => {
	test("should parse a simple INSERT query", () => {
		const query = "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add"); // INSERT maps to "add" method
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("users"); // collection name
		expect(parsedQuery.args[1]).toEqual({ name: "John", email: "john@example.com" }); // data
	});

	test("should parse INSERT with numeric values", () => {
		const query = "INSERT INTO products (id, name, price) VALUES (1, 'Laptop', 999.99)";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add");
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("products"); // collection name
		expect(parsedQuery.args[1]).toEqual({ id: 1, name: "Laptop", price: 999.99 }); // data with numeric values
	});

	test("should parse INSERT with mixed data types", () => {
		const query = "INSERT INTO users (id, name, active, score) VALUES (1, 'Jane', true, 95.5)";
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add");
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("users"); // collection name
		expect(parsedQuery.args[1]).toEqual({ id: 1, name: "Jane", active: "true", score: 95.5 });
	});

	test("should handle INSERT with quoted values containing commas", () => {
		const query = `INSERT INTO posts (title, content) VALUES ('Hello, World!', 'This is a post, with commas.')`;
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add");
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("posts"); // collection name
		expect(parsedQuery.args[1]).toEqual({
			title: "Hello, World!",
			content: "This is a post, with commas."
		});
	});

	test("should throw error for mismatched columns and values", () => {
		const query = "INSERT INTO users (name, email) VALUES ('John')"; // missing value

		expect(() => {
			sqlParser.parse(query);
		}).toThrow("Number of columns and values does not match");
	});

	test("should throw error for invalid INSERT syntax", () => {
		const query = "INSERT users (name) VALUES ('John')"; // missing INTO

		expect(() => {
			sqlParser.parse(query);
		}).toThrow("Invalid INSERT syntax");
	});

	test("should handle INSERT with double quotes", () => {
		const query = 'INSERT INTO users (name, email) VALUES ("Jane", "jane@example.com")';
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add");
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("users"); // collection name
		expect(parsedQuery.args[1]).toEqual({ name: "Jane", email: "jane@example.com" });
	});

	test("should handle INSERT with mixed quote types", () => {
		const query = `INSERT INTO users (name, email, description) VALUES ("Jane", 'jane@example.com', "User, with 'special' chars")`;
		const parsedQuery = sqlParser.parse(query);

		expect(parsedQuery).toBeDefined();
		expect(parsedQuery.method).toBe("add");
		expect(parsedQuery.args).toHaveLength(2);
		expect(parsedQuery.args[0]).toBe("users"); // collection name
		expect(parsedQuery.args[1]).toEqual({
			name: "Jane",
			email: "jane@example.com",
			description: "User, with 'special' chars"
		});
	});
});