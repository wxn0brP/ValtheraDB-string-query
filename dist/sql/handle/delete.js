import { parseReturn } from "../../sql/utils/index.js";
import { parseWhere } from "../../sql/where.js";
export function handleDelete(query) {
    const match = query.match(/DELETE FROM ([\w\/]+)(?: WHERE (.+))?/i);
    if (!match)
        throw new Error("Invalid DELETE syntax");
    const collection = match[1];
    const whereClause = match[2] ? parseWhere(match[2]) : {};
    return parseReturn("remove", collection, { search: whereClause });
}
//# sourceMappingURL=delete.js.map