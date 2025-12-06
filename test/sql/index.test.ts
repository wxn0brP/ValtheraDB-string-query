import SQLParser from "#sql";
import { describe, expect, test } from "bun:test";

const sqlParser = new SQLParser();

describe("SQL Parser - SELECT", () => {
    test("1. should parse with ;", () => {
        const query = "SELECT * FROM users WHERE id = 1;";
        const parsedQuery = sqlParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(4);
        expect(parsedQuery.args[0]).toBe("users"); // collection name
        expect(parsedQuery.args[1]).toEqual({ id: 1 }); // where clause
    });
});