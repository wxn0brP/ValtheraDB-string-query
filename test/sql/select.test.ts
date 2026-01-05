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

    test("1b. should parse a simple SELECT query without spaces", () => {
        const query = "SELECT * FROM users WHERE id=1";
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
        expect(parsedQuery.args[1]).toEqual({ active: 1 }); // where clause
        expect(parsedQuery.args[3]).toEqual({ select: ["name", "email"] }); // select options
    });

    test("2b. should parse a SELECT query with NOT IN", () => {
        const query = "SELECT * FROM users WHERE status NOT IN (1, 2)";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users");
        expect(parsedQuery.args[1]).toEqual({ $nin: { status: [1, 2] } });
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
                path: ['db', 'users'],
                pk: 'userId',
                fk: 'id',
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

    test("8. should parse LIKE operator", () => {
        const query = "SELECT * FROM users WHERE name LIKE '%John%'";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $regex: { name: "^.*John.*$" } });
    });

    test("8b. should parse NOT LIKE operator", () => {
        const query = "SELECT * FROM users WHERE name NOT LIKE '%John%'";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $not: { $regex: { name: "^.*John.*$" } } });
    });

    test("9. should parse IS NULL operator", () => {
        const query = "SELECT * FROM users WHERE deletedAt IS NULL";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ deletedAt: null });
    });

    test("9b. should parse IS NOT NULL operator", () => {
        const query = "SELECT * FROM users WHERE deletedAt IS NOT NULL";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $not: { deletedAt: null } });
    });

    test("10. should parse NOT ANY operator (alias for NOT IN)", () => {
        const query = "SELECT * FROM users WHERE status NOT ANY (1, 2)";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $nin: { status: [1, 2] } });
    });

    test("11. should parse ILIKE operator (case insensitive LIKE)", () => {
        const query = "SELECT * FROM users WHERE name ILIKE '%john%'";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $regex: { name: "(?i)^.*john.*$" } });
    });

    test("11b. should parse NOT ILIKE operator", () => {
        const query = "SELECT * FROM users WHERE name NOT ILIKE '%john%'";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $not: { $regex: { name: "(?i)^.*john.*$" } } });
    });

    test("12. should parse BETWEEN operator", () => {
        const query = "SELECT * FROM users WHERE age BETWEEN 18 AND 30";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $between: { age: [18, 30] } });
    });

    test("12b. should parse NOT BETWEEN operator", () => {
        const query = "SELECT * FROM users WHERE age NOT BETWEEN 18 AND 30";
        const parsedQuery = sqlParser.parse(query);
        expect(parsedQuery.args[1]).toEqual({ $not: { $between: { age: [18, 30] } } });
    });
});