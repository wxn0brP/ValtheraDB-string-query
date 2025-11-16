import { describe, expect, test } from "bun:test";
import { ValtheraDbParsers } from "../../index.js";
const sqlParser = new ValtheraDbParsers.sql();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC9zcWwvaW5zZXJ0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUUxQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTlDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLEtBQUssR0FBRyxxRUFBcUUsQ0FBQztRQUNwRixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDhCQUE4QjtRQUN0RSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUM3RCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU87SUFDMUYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMs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