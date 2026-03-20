import { handleCreate, handleDrop, handleExists, handleGet } from "./handle/collection.js";
import { handleDelete } from "./handle/delete.js";
import { handleInsert } from "./handle/insert.js";
import { handleSelect } from "./handle/select.js";
import { handleUpdate } from "./handle/update.js";
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
            throw new Error("Unknown query: " + tokens[0]);
        }
    }
}
export default SQLParser;
//# sourceMappingURL=index.js.map