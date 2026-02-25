import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - UPDATE", () => {
    test("1. should parse a simple UPDATE query", () => {
        const query = "UPDATE users SET name = 'John' WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update"); // UPDATE maps to "update" method
        expect(parsedQuery.query.collection).toBe("users"); // collection name
        expect(parsedQuery.query.search).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.query.updater).toEqual({ name: "John" }); // set clause
    });

    test("2. should parse UPDATE with multiple SET fields", () => {
        const query = "UPDATE users SET name = 'Jane', email = 'jane@example.com' WHERE id = 2";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.query.collection).toBe("users"); // collection name
        expect(parsedQuery.query.search).toEqual({ id: 2 }); // where clause
        expect(parsedQuery.query.updater).toEqual({ name: "Jane", email: "jane@example.com" }); // set clause
    });

    test("3. should parse UPDATE with numeric values", () => {
        const query = "UPDATE products SET price = 29.99, stock = 100 WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.query.collection).toBe("products"); // collection name
        expect(parsedQuery.query.search).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.query.updater).toEqual({ price: 29.99, stock: 100 }); // set clause
    });

    test("4. should parse UPDATE with string values containing spaces", () => {
        const query = "UPDATE posts SET title = 'Hello World Post', content = 'This is the content' WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.query.collection).toBe("posts"); // collection name
        expect(parsedQuery.query.search).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.query.updater).toEqual({
            title: "Hello World Post",
            content: "This is the content"
        }); // set clause
    });

    test("5. should throw error for invalid UPDATE syntax", () => {
        const query = "UPDATE users name = 'John' WHERE id = 1"; // missing SET keyword

        expect(() => {
            sqlParser.parse(query);
        }).toThrow("Invalid UPDATE syntax");
    });

    test("6. should handle UPDATE with complex WHERE conditions", () => {
        const query = "UPDATE users SET status = 'inactive' WHERE age > 65 AND active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.query.collection).toBe("users"); // collection name
        expect(parsedQuery.query.search).toEqual({ $gt: { age: 65 }, active: 1 }); // where clause
        expect(parsedQuery.query.updater).toEqual({ status: "inactive" }); // set clause
    });

    test("7. should throw error when there is no WHERE clause", () => {
        const query = "UPDATE users SET name = 'John'"; // missing WHERE

        expect(() => {
            sqlParser.parse(query);
        }).toThrow("Invalid UPDATE syntax");
    });
});
