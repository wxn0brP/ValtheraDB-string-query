import { parseReturn } from "#sql/utils";
import { parseWhere } from "#sql/where";

export function handleSelect(query: string) {
    const match = query.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)(?:\s+WHERE\s+(.+))?/i);
    if (!match) throw new Error("Invalid SELECT syntax");

    const columnsPart = match[1].trim();
    const collection = match[2];
    const whereClause = match[3] ? parseWhere(match[3]) : {};

    const findOpts = parseSelectClause(columnsPart);
    return parseReturn("find", [collection, whereClause, {}, findOpts]);
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
