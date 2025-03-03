import { ValtheraParser, ValtheraQuery } from "./types";

class ValtheraSQLParser implements ValtheraParser {
    parse(query: string) {
        query = query.trim();
        const tokens = query.split(/\s+/);

        if (tokens[0].toUpperCase() === "SELECT") {
            return this.handleSelect(query);
        } else if (tokens[0].toUpperCase() === "INSERT") {
            return this.handleInsert(query);
        } else if (tokens[0].toUpperCase() === "UPDATE") {
            return this.handleUpdate(query);
        } else if (tokens[0].toUpperCase() === "DELETE") {
            return this.handleDelete(query);
        } else {
            throw new Error("Unknown query: " + tokens[0]);
        }
    }

    private parseReturn(method: string, args: any[]): ValtheraQuery {
        return { method, args };
    }

    private handleSelect(query: string) {
        const match = query.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)(?:\s+WHERE\s+(.+))?/i);
        if (!match) throw new Error("Invalid SELECT syntax");

        const columnsPart = match[1].trim();
        const collection = match[2];
        const whereClause = match[3] ? this.parseWhere(match[3]) : {};

        const findOpts = this.parseSelectClause(columnsPart);
        return this.parseReturn("find", [collection, whereClause, {}, {}, findOpts]);
    }

    private parseSelectClause(selectClause: string): { select?: string[]; exclude?: string[] } {
        selectClause = selectClause.trim();
    
        if (selectClause === "*") return {};
    
        const excludeMatch = selectClause.match(/\*\s+EXCLUDE\s+(.+)/i);
        if (excludeMatch) {
            return {
                exclude: excludeMatch[1].split(/\s*,\s*/),
            };
        }
    
        return {
            select: selectClause.split(/\s*,\s*/),
        };
    }

    private handleInsert(query: string) {
        const match = query.match(/INSERT INTO ([\w\/]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
        if (!match) throw new Error("Invalid INSERT syntax");

        const collection = match[1];
        const keys = match[2].split(/\s*,\s*/);
        const values = match[3].split(/\s*,\s*/).map(v => v.replace(/^'|'$/g, ""));

        if (keys.length !== values.length) throw new Error("Number of columns and values does not match");

        const data = Object.fromEntries(keys.map((k, i) => [k, isNaN(values[i] as any) ? values[i] : Number(values[i])]));

        return this.parseReturn("add", [collection, data]);
    }

    private handleUpdate(query: string) {
        const match = query.match(/UPDATE\s+([\w\/]+)\s+SET\s+(.+)\s+WHERE\s+(.+)/i);
        if (!match) throw new Error("Invalid UPDATE syntax");

        const collection = match[1];
        const setClause = this.parseSet(match[2]);
        const whereClause = this.parseWhere(match[3]);

        return this.parseReturn("update", [collection, whereClause, setClause]);
    }

    private handleDelete(query: string) {
        const match = query.match(/DELETE FROM ([\w\/]+)(?: WHERE (.+))?/i);
        if (!match) throw new Error("Invalid DELETE syntax");

        const collection = match[1];
        const whereClause = match[2] ? this.parseWhere(match[2]) : {};

        return this.parseReturn("remove", [collection, whereClause]);
    }

    private parseWhere(condition: string) {
        condition = condition.replace(/\s+AND\s+/gi, " && ").replace(/\s+OR\s+/gi, " || ");
        return this.buildQueryTree(condition);
    }

    private buildQueryTree(condition: string) {
        if (condition.includes(" || ")) {
            return { $or: condition.split(" || ").map(sub => this.buildQueryTree(sub.trim())) };
        } else if (condition.includes(" && ")) {
            return { $and: condition.split(" && ").map(sub => this.buildQueryTree(sub.trim())) };
        } else {
            return this.parseSingleCondition(condition);
        }
    }

    private parseSingleCondition(condition: string) {
        const match = condition.match(/(\w+)\s*(=|>|<)\s*('?\d+|'?[\w\s]+'?)/);
        if (!match) throw new Error("Invalid condition: " + condition);

        let [, key, operator, value]: any = match;
        value = value.replace(/^'|'$/g, "");
        if (!isNaN(value)) value = Number(value);

        if (operator === "=") return { [key]: value };
        if (operator === ">") return { $gt: { [key]: value } };
        if (operator === "<") return { $lt: { [key]: value } };

        throw new Error("Unsupported operator: " + operator);
    }

    private parseSet(setString: string) {
        return Object.fromEntries(
            setString.split(/\s*,\s*/).map(pair => {
                const [key, value]: any = pair.split(/\s*=\s*/);
                let parsedValue = value.replace(/^'|'$/g, "");
                if (!isNaN(parsedValue)) parsedValue = Number(parsedValue);
                return [key, parsedValue];
            })
        );
    }
}

const valtheraSQLParser = new ValtheraSQLParser();
export default valtheraSQLParser;