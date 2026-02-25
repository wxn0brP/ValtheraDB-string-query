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
        return {
            method: "relation-find",
            query: {},
            relation: [path, whereClause, relations, findOpts]
        };
    }
    return parseReturn("find", collection, { search: whereClause, findOpts });
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
//# sourceMappingURL=select.js.map