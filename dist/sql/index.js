import { handleCreate, handleDrop, handleExists, handleGet, } from "./handle/collection.js";
import { handleDelete } from "./handle/delete.js";
import { handleInsert } from "./handle/insert.js";
import { handleSelect } from "./handle/select.js";
import { handleUpdate } from "./handle/update.js";
const SQL_METHODS = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "GET",
    "CREATE",
    "DROP",
    "EXISTS",
];
class SQLParser {
    parse(query, opts) {
        query = query.replace(/\s+/g, " ").trim();
        if (query.endsWith(";"))
            query = query.slice(0, -1);
        const tokens = query.split(/\s+/);
        const method = tokens[0].toUpperCase();
        if (method === "SELECT") {
            return handleSelect(query, opts);
        }
        else if (method === "INSERT") {
            return handleInsert(query);
        }
        else if (method === "UPDATE") {
            return handleUpdate(query);
        }
        else if (method === "DELETE") {
            return handleDelete(query);
        }
        // collection
        else if (method === "GET") {
            return handleGet(query);
        }
        else if (method === "CREATE") {
            return handleCreate(query);
        }
        else if (method === "DROP") {
            return handleDrop(query);
        }
        else if (method === "EXISTS") {
            return handleExists(query);
        }
        else {
            throw new Error(formatUnknownMethodError(tokens[0]));
        }
    }
}
function formatUnknownMethodError(method) {
    const suggestion = findClosest(method.toUpperCase(), SQL_METHODS);
    return suggestion
        ? `Unknown SQL command '${method}'. Did you mean '${suggestion}'?`
        : `Unknown SQL command '${method}'`;
}
function findClosest(value, candidates) {
    let closest;
    let closestDistance = Infinity;
    for (const candidate of candidates) {
        const distance = levenshtein(value, candidate);
        if (distance < closestDistance) {
            closest = candidate;
            closestDistance = distance;
        }
    }
    return closestDistance <= 2 ? closest : undefined;
}
function levenshtein(a, b) {
    const dp = Array.from({
        length: a.length + 1,
    }, (_, i) => [
        i,
    ]);
    for (let j = 1; j <= b.length; j++)
        dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
    }
    return dp[a.length][b.length];
}
export default SQLParser;
//# sourceMappingURL=index.js.map