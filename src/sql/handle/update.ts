import { parseReturn, parseSet } from "#sql/utils";
import { parseWhere } from "#sql/where";

export function handleUpdate(query: string) {
    const match = query.match(/UPDATE\s+([\w\/]+)\s+SET\s+(.+)\s+WHERE\s+(.+)/i);
    if (!match) throw new Error("Invalid UPDATE syntax");

    const collection = match[1];
    const setClause = parseSet(match[2]);
    const whereClause = parseWhere(match[3]);

    return parseReturn("update", [collection, whereClause, setClause]);
}