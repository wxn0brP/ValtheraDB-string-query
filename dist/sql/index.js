import { handleCreate, handleDelete, handleDrop, handleExists, handleGet, handleInsert, handleSelect, handleUpdate } from "./handle.js";
class SQLParser {
    parse(query) {
        query = query.replace(/\s+/g, " ").trim();
        const tokens = query.split(/\s+/);
        const method = tokens[0].toUpperCase();
        if (method === "SELECT") {
            return handleSelect(query);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3FsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDSCxZQUFZLEVBQ1osWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixZQUFZLEVBQ1osWUFBWSxFQUNmLE1BQU0sVUFBVSxDQUFDO0FBRWxCLE1BQU0sU0FBUztJQUNYLEtBQUssQ0FBQyxLQUFhO1FBQ2YsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXZDLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzdCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDRCxhQUFhO2FBQ1IsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDeEIsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzdCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUMzQixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDO2FBQU0sSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQzthQUFNLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxlQUFlLFNBQVMsQ0FBQyJ9