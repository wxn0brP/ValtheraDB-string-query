import { ValtheraParser } from "../types";
import { handleDelete, handleInsert, handleSelect, handleUpdate } from "./handle";

class SQLParser implements ValtheraParser {
    parse(query: string) {
        query = query.trim();
        const tokens = query.split(/\s+/);

        if (tokens[0].toUpperCase() === "SELECT") {
            return handleSelect(query);
        } else if (tokens[0].toUpperCase() === "INSERT") {
            return handleInsert(query);
        } else if (tokens[0].toUpperCase() === "UPDATE") {
            return handleUpdate(query);
        } else if (tokens[0].toUpperCase() === "DELETE") {
            return handleDelete(query);
        } else {
            throw new Error("Unknown query: " + tokens[0]);
        }
    }
}

export default SQLParser;