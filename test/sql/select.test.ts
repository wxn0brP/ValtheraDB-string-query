import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - SELECT", () => {
    test("1. should parse a simple SELECT query", () => {
        const query = "SELECT * FROM users WHERE id = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
    });

    test("2. should parse a SELECT query with specific columns", () => {
        const query = "SELECT name, email FROM users WHERE active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ active: 1 }); // where clause
        expect(parsedQuery.args[3]).toEqual({ select: ["name", "email"] }); // select options
    });

    test("3. should parse a SELECT query without WHERE clause", () => {
        const query = "SELECT * FROM users";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({}); // empty where clause
    });

    test("4. should parse a SELECT query with EXCLUDE clause", () => {
        const query = "SELECT * EXCLUDE password, createdAt FROM users WHERE active = 1";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ active: 1 }); // where clause
        expect(parsedQuery.args[3]).toEqual({ exclude: ["password", "createdAt"] }); // exclude options
    });

    test("5. should parse a SELECT query with complex WHERE conditions", () => {
        const query = "SELECT * FROM users WHERE age > 18 AND status = 'active'";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ $gt: { age: 18 }, status: "active" }); // where clause
    });

    test("6. should parse a SELECT query with a JOIN clause", () => {
        const query = "SELECT posts.*, users.name FROM posts JOIN users ON posts.userId = users.id WHERE posts.id = 1";
        const parsedQuery = sqlParser.parse(query, { defaultDbKey: "db" });

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("relation-find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toEqual(["db", "posts"]); // path
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
        expect(parsedQuery.args[2]).toEqual({
            users: {
                type: '1n',
                path: ['db', 'posts'],
                pk: 'id',
                fk: 'userId',
                as: 'users'
            }
        }); // relations
        expect(parsedQuery.args[3]).toEqual({ select: ["posts.*", "users.name"] }); // select options
    });

    test("7. should throw error for invalid SELECT syntax", () => {
        const query = "SELECT FROM users";

        expect(() => {
            sqlParser.parse(query);
        }).toThrow();
    });
});