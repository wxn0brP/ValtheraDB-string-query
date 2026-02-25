import { parseReturn, parseSet } from "../../sql/utils/index.js";
import { parseWhere } from "../../sql/where.js";
export function handleUpdate(query) {
    const match = query.match(/UPDATE\s+([\w\/]+)\s+SET\s+(.+)\s+WHERE\s+(.+)/i);
    if (!match)
        throw new Error("Invalid UPDATE syntax");
    const collection = match[1];
    const setClause = parseSet(match[2]);
    const whereClause = parseWhere(match[3]);
    return parseReturn("update", collection, { search: whereClause, updater: setClause });
}
//# sourceMappingURL=update.js.map