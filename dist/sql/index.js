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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3FsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsTUFBTSxTQUFTO0lBQ1gsS0FBSyxDQUNELEtBQWEsRUFDYixJQUFXO1FBRVgsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV2QyxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN0QixPQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzdCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELGFBQWE7YUFDUixJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUN4QixPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQzNCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELGVBQWUsU0FBUyxDQUFDIn0=