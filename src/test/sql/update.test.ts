import { describe, expect, test } from "bun:test";
import { ValtheraDbParsers } from "../..";

const sqlParser = new ValtheraDbParsers.sql();

describe("SQL Parser - UPDATE", () => {
    test("should parse a simple UPDATE query", () => {
        const query = "UPDATE users SET name = 'John' WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update"); // UPDATE maps to "update" method
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.args[2]).toEqual({ name: "John" }); // set clause
    });

    test("should parse UPDATE with multiple SET fields", () => {
        const query = "UPDATE users SET name = 'Jane', email = 'jane@example.com' WHERE id = 2";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 2 }); // where clause
        expect(parsedQuery.args[2]).toEqual({ name: "Jane", email: "jane@example.com" }); // set clause
    });

    test("should parse UPDATE with numeric values", () => {
        const query = "UPDATE products SET price = 29.99, stock = 100 WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe("products"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.args[2]).toEqual({ price: 29.99, stock: 100 }); // set clause
    });

    test("should parse UPDATE with string values containing spaces", () => {
        const query = "UPDATE posts SET title = 'Hello World Post', content = 'This is the content' WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe("posts"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.args[2]).toEqual({
            title: "Hello World Post",
            content: "This is the content"
        }); // set clause
    });

    test("should throw error for invalid UPDATE syntax", () => {
        const query = "UPDATE users name = 'John' WHERE id = 1"; // missing SET keyword

        expect(() => {
            sqlParser.parse(query);
        }).toThrow("Invalid UPDATE syntax");
    });

    test("should handle UPDATE with complex WHERE conditions", () => {
        const query = "UPDATE users SET status = 'inactive' WHERE age > 65 AND active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("update");
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ $gt: { age: 65 }, active: 1 }); // where clause
        expect(parsedQuery.args[2]).toEqual({ status: "inactive" }); // set clause
    });

    test("should throw error when there is no WHERE clause", () => {
        const query = "UPDATE users SET name = 'John'"; // missing WHERE

        expect(() => {
            sqlParser.parse(query);
        }).toThrow("Invalid UPDATE syntax");
    });
});