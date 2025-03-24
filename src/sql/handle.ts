import { parseReturn } from "./utils";
import { parseWhere } from "./where";

export function handleSelect(query: string) {
    const match = query.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)(?:\s+WHERE\s+(.+))?/i);
    if (!match) throw new Error("Invalid SELECT syntax");

    const columnsPart = match[1].trim();
    const collection = match[2];
    const whereClause = match[3] ? parseWhere(match[3]) : {};

    const findOpts = parseSelectClause(columnsPart);
    return parseReturn("find", [collection, whereClause, {}, {}, findOpts]);
}

export function parseSelectClause(selectClause: string): { select?: string[]; exclude?: string[] } {
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

export function handleInsert(query: string) {
    const match = query.match(/INSERT INTO ([\w\/]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!match) throw new Error("Invalid INSERT syntax");

    const collection = match[1];
    const keys = match[2].split(/\s*,\s*/);
    const values = match[3].split(/\s*,\s*/).map(v => v.replace(/^'|'$/g, ""));

    if (keys.length !== values.length) throw new Error("Number of columns and values does not match");

    const data = Object.fromEntries(keys.map((k, i) => [k, isNaN(values[i] as any) ? values[i] : Number(values[i])]));

    return parseReturn("add", [collection, data]);
}

export function handleUpdate(query: string) {
    const match = query.match(/UPDATE\s+([\w\/]+)\s+SET\s+(.+)\s+WHERE\s+(.+)/i);
    if (!match) throw new Error("Invalid UPDATE syntax");

    const collection = match[1];
    const setClause = this.parseSet(match[2]);
    const whereClause = parseWhere(match[3]);

    return parseReturn("update", [collection, whereClause, setClause]);
}

export function handleDelete(query: string) {
    const match = query.match(/DELETE FROM ([\w\/]+)(?: WHERE (.+))?/i);
    if (!match) throw new Error("Invalid DELETE syntax");

    const collection = match[1];
    const whereClause = match[2] ? parseWhere(match[2]) : {};

    return parseReturn("remove", [collection, whereClause]);
}

// collection
export function handleGet(query: string) {
    if (!/^GET\s+COLLECTIONS$/i.test(query)) {
        throw new Error("Invalid GET COLLECTIONS syntax.");
    }
    return parseReturn("getCollections", []);
}

export function handleCreate(query: string) {
    const match = query.match(/^CREATE\s+COLLECTION\s+(\w+)$/i);
    if (!match) throw new Error("Invalid CREATE COLLECTION syntax.");
    return parseReturn("checkCollection", [match[1]]);
}

export function handleDrop(query: string) {
    const match = query.match(/^DROP\s+COLLECTION\s+(\w+)$/i);
    if (!match) throw new Error("Invalid DROP COLLECTION syntax.");
    return parseReturn("removeCollection", [match[1]]);
}

export function handleExists(query: string) {
    const match = query.match(/^EXISTS\s+COLLECTION\s+(\w+)$/i);
    if (!match) throw new Error("Invalid EXISTS COLLECTION syntax.");
    return parseReturn("issetCollection", [match[1]]);
}