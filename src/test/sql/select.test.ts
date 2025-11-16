import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - SELECT", () => {
    test("should parse a simple SELECT query", () => {
        const query = "SELECT * FROM users WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
    });

    test("should parse a SELECT query with specific columns", () => {
        const query = "SELECT name, email FROM users WHERE active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ active: 1 }); // where clause
        expect(parsedQuery.args[3]).toEqual({ select: ["name", "email"] }); // select options
    });

    test("should parse a SELECT query without WHERE clause", () => {
        const query = "SELECT * FROM users";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({}); // empty where clause
    });

    test("should parse a SELECT query with EXCLUDE clause", () => {
        const query = "SELECT * EXCLUDE password, createdAt FROM users WHERE active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ active: 1 }); // where clause
        expect(parsedQuery.args[3]).toEqual({ exclude: ["password", "createdAt"] }); // exclude options
    });

    test("should parse a SELECT query with complex WHERE conditions", () => {
        const query = "SELECT * FROM users WHERE age > 18 AND status = 'active'";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ $gt: { age: 18 }, status: "active" }); // where clause
    });

    test("should throw error for invalid SELECT syntax", () => {
        const query = "SELECT FROM users";

        expect(() => {
            sqlParser.parse(query);
        }).toThrow();
    });
});