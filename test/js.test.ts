import { describe, expect, test } from "bun:test";
import { ValtheraDbParsers } from "#index";

const jsParser = new ValtheraDbParsers.js();

describe("JS-like Parser", () => {
    test("should parse a simple method call with arguments", () => {
        const query = "myMethod(1, 'hello')";
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("myMethod");
        expect(parsedQuery.args).toHaveLength(2);
        expect(parsedQuery.args[0]).toBe(1);
        expect(parsedQuery.args[1]).toBe("hello");
    });

    test("should parse method call with object argument", () => {
        const query = `find({ id: 1, name: "John" })`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("find");
        expect(parsedQuery.args).toHaveLength(1);
        expect(parsedQuery.args[0]).toEqual({ id: 1, name: "John" });
    });

    test("should parse method call with array argument", () => {
        const query = `myMethod([1, 2, 3])`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("myMethod");
        expect(parsedQuery.args).toHaveLength(1);
        expect(parsedQuery.args[0]).toEqual([1, 2, 3]);
    });

    test("should parse method call with nested objects and arrays", () => {
        const query = `complexMethod({ users: [{ id: 1, active: true }], settings: { theme: "dark" } })`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("complexMethod");
        expect(parsedQuery.args).toHaveLength(1);
        expect(parsedQuery.args[0]).toEqual({
            users: [{ id: 1, active: true }],
            settings: { theme: "dark" }
        });
    });

    test("should parse method call with mixed argument types", () => {
        const query = `mixedArgs(42, "text", true, null, [1, "two", false])`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("mixedArgs");
        expect(parsedQuery.args).toHaveLength(5);
        expect(parsedQuery.args[0]).toBe(42);
        expect(parsedQuery.args[1]).toBe("text");
        expect(parsedQuery.args[2]).toBe(true);
        expect(parsedQuery.args[3]).toBeNull();
        expect(parsedQuery.args[4]).toEqual([1, "two", false]);
    });

    test("should handle string arguments with quotes", () => {
        const query = `stringMethod("double quotes", 'single quotes')`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("stringMethod");
        expect(parsedQuery.args).toHaveLength(2);
        expect(parsedQuery.args[0]).toBe("double quotes");
        expect(parsedQuery.args[1]).toBe("single quotes");
    });

    test("should throw error for invalid query syntax", () => {
        const query = "invalidQuery";

        expect(() => {
            jsParser.parse(query);
        }).toThrow("Invalid query");
    });

    test("should throw error for malformed arguments", () => {
        const query = "method({unclosed: object";

        expect(() => {
            jsParser.parse(query);
        }).toThrow();
    });

    test("should parse floating point numbers correctly", () => {
        const query = `numberMethod(3.14, -2.5, 0.001)`;
        const parsedQuery = jsParser.parse(query);

        expect(parsedQuery).toBeDefined();
        expect(parsedQuery.method).toBe("numberMethod");
        expect(parsedQuery.args).toHaveLength(3);
        expect(parsedQuery.args[0]).toBe(3.14);
        expect(parsedQuery.args[1]).toBe(-2.5);
        expect(parsedQuery.args[2]).toBe(0.001);
    });
});