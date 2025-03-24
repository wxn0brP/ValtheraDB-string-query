import { ValtheraParser } from "../types";
import { handleDelete, handleInsert, handleSelect, handleUpdate } from "./handle";

class SQLParser implements ValtheraParser {
    parse(query: string) {
        query = query.trim();
        const tokens = query.split(/\s+/);
        const method = tokens[0].toUpperCase();

        if (method === "SELECT") {
            return handleSelect(query);
        } else if (method === "INSERT") {
            return handleInsert(query);
        } else if (method === "UPDATE") {
            return handleUpdate(query);
        } else if (method === "DELETE") {
            return handleDelete(query);
        } else {
            throw new Error("Unknown query: " + tokens[0]);
        }
    }
}

export default SQLParser;