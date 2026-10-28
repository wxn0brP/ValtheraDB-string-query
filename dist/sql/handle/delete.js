import { COLLECTION_SRC, parseReturn, stripIdentQuotes } from "../utils/index.js";
import { parseWhere } from "../where.js";
export function handleDelete(query) {
    const match = query.match(new RegExp(`DELETE FROM (${COLLECTION_SRC})(?: WHERE (.+))?`, "i"));
    if (!match)
        throw new Error("Invalid DELETE syntax");
    const collection = stripIdentQuotes(match[1]);
    const whereClause = match[2] ? parseWhere(match[2]) : {};
    return parseReturn("remove", collection, {
        search: whereClause,
    });
}
//# sourceMappingURL=delete.js.map