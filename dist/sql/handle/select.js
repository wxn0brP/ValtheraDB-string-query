import { parseReturn } from "../../sql/utils/index.js";
import { parseWhere } from "../../sql/where.js";
import { JoinToRelationsEngine } from "../../sql/utils/join.util.js";
export function handleSelect(query, opts) {
    let whereClauseStr;
    let mainQueryPart = query;
    const whereIndex = query.toUpperCase().lastIndexOf(" WHERE ");
    if (whereIndex !== -1) {
        whereClauseStr = query.substring(whereIndex + 7).trim();
        mainQueryPart = query.substring(0, whereIndex);
    }
    const match = mainQueryPart.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)((?:\s+JOIN\s+.+)*)?/i);
    if (!match)
        throw new Error("Invalid SELECT syntax");
    const columnsPart = match[1].trim();
    const collection = match[2];
    const joinPart = match[3] || "";
    const whereClause = whereClauseStr ? parseWhere(whereClauseStr) : {};
    const findOpts = parseSelectClause(columnsPart);
    if (joinPart && opts?.defaultDbKey) {
        const joinClauses = parseJoinClauses(joinPart);
        const relationsEngine = new JoinToRelationsEngine(opts.defaultDbKey, opts.tableDbMap);
        const relations = relationsEngine.buildRelations(joinClauses, collection);
        const path = [opts.defaultDbKey, collection];
        return parseReturn("relation-find", [path, whereClause, relations, findOpts]);
    }
    return parseReturn("find", [collection, whereClause, {}, findOpts]);
}
export function parseJoinClauses(joinPart) {
    const joinClauses = {};
    const joinRegex = /\s+JOIN\s+([\w\/]+)(?:\s+AS\s+)?([\w\/]+)?\s+ON\s+([^\s]+)\s*=\s*([^\s]+)/gi;
    let match;
    while ((match = joinRegex.exec(joinPart)) !== null) {
        const table = match[1];
        const alias = match[2] || table;
        const condition = `${match[3]} = ${match[4]}`;
        joinClauses[alias] = condition;
    }
    return joinClauses;
}
export function parseSelectClause(selectClause) {
    selectClause = selectClause.trim();
    if (selectClause === "*")
        return {};
    const excludeMatch = selectClause.match(/\*\s+EXCLUDE\s+(.+)/i);
    if (excludeMatch) {
        return {
            exclude: excludeMatch[1].split(/\s*,\s*/),
        };
    }
    return {
        select: selectClause.split(/\s*,\s*/),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NxbC9oYW5kbGUvc2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUV4QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxNQUFNLFVBQVUsWUFBWSxDQUN4QixLQUFhLEVBQ2IsSUFBVztJQUVYLElBQUksY0FBa0MsQ0FBQztJQUN2QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFFMUIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5RCxJQUFJLFVBQVUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3BCLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4RCxhQUFhLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztJQUM1RixJQUFJLENBQUMsS0FBSztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUVyRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEMsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVyRSxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVoRCxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUM7UUFDakMsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsTUFBTSxlQUFlLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RixNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxRSxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsT0FBTyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLFFBQWdCO0lBQzdDLE1BQU0sV0FBVyxHQUEyQixFQUFFLENBQUM7SUFDL0MsTUFBTSxTQUFTLEdBQUcsNkVBQTZFLENBQUM7SUFDaEcsSUFBSSxLQUFLLENBQUM7SUFDVixPQUFPLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUNqRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM5QyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ25DLENBQUM7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLFlBQW9CO0lBQ2xELFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbkMsSUFBSSxZQUFZLEtBQUssR0FBRztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBRXBDLE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNoRSxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2YsT0FBTztZQUNILE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztTQUM1QyxDQUFDO0lBQ04sQ0FBQztJQUVELE9BQU87UUFDSCxNQUFNLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7S0FDeEMsQ0FBQztBQUNOLENBQUMifQ==