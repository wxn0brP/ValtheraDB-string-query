import { parseReturn } from "#sql/utils";
import { parseWhere } from "#sql/where";

export function handleDelete(query: string) {
    const match = query.match(/DELETE FROM ([\w\/]+)(?: WHERE (.+))?/i);
    if (!match) throw new Error("Invalid DELETE syntax");

    const collection = match[1];
    const whereClause = match[2] ? parseWhere(match[2]) : {};

    return parseReturn("remove", collection, { search: whereClause });
}
