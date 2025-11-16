const operators = {
    "=": null,
    "<": "$lt",
    ">": "$gt",
    "<=": "$lte",
    ">=": "$gte",
    "!=": "$not",
    "IN": "$in",
    "NOT IN": "$nin"
};
function mergeQueries(target, source) {
    for (const key in source) {
        if (key.startsWith('$')) {
            // If the key is an operator, simply add it
            target[key] = source[key];
        }
        else {
            // If the key is a field, check if there is not already an operator in the target
            if (target[key] !== undefined) {
                // If target[key] is an object with an operator, merge the objects
                if (typeof target[key] === 'object' && !Array.isArray(target[key])) {
                    Object.assign(target[key], source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
            else {
                target[key] = source[key];
            }
        }
    }
}
export function parseWhere(where) {
    if (!where)
        return {};
    const trimmed = where.trim();
    if (trimmed === "" || trimmed === "1")
        return {};
    // Tokenize the input string, handling parentheses and quoted values
    const tokens = where
        .replace(/\s+(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/g, " ")
        .match(/(?:\(|\)|'[^']*'|"[^"]*"|[^\s()'"]+)/g) || [];
    let frames = [];
    let current = {};
    let operatorStack = [];
    let stack = [];
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i].trim();
        if (!token)
            continue;
        if (token === '(') {
            // Push current context to the stack and reset for the new group
            frames.push({ current, operatorStack, stack });
            current = {};
            operatorStack = [];
            stack = [];
        }
        else if (token === ')') {
            // Combine current and stack into a grouped query
            let groupedQuery = current;
            if (stack.length > 0) {
                stack.push(current);
                groupedQuery = { $or: stack };
            }
            if (frames.length === 0) {
                throw new Error("Unmatched closing parenthesis");
            }
            const parentFrame = frames.pop();
            const parentCurrent = parentFrame.current;
            const parentOperatorStack = parentFrame.operatorStack;
            const parentStack = parentFrame.stack;
            // Merge the grouped query into the parent context
            if (parentOperatorStack.length > 0) {
                const op = parentOperatorStack.pop();
                if (op === "OR") {
                    parentStack.push(parentCurrent);
                    current = groupedQuery;
                }
                else if (op === "AND") {
                    const newCurrent = {};
                    mergeQueries(newCurrent, parentCurrent);
                    mergeQueries(newCurrent, groupedQuery);
                    current = newCurrent;
                }
            }
            else {
                const newCurrent = {};
                mergeQueries(newCurrent, parentCurrent);
                mergeQueries(newCurrent, groupedQuery);
                current = newCurrent;
            }
            // Restore parent's stack and operator stack
            operatorStack = parentFrame.operatorStack;
            stack = parentFrame.stack;
        }
        else if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
            operatorStack.push(token.toUpperCase());
        }
        else {
            // Process condition (key, operator, value)
            if (operatorStack.length) {
                const op = operatorStack[operatorStack.length - 1];
                if (op === "OR") {
                    stack.push(current);
                    current = {};
                    operatorStack.pop();
                }
            }
            let key = token;
            let opToken = tokens[++i]?.trim();
            let value = tokens[++i]?.trim();
            if (!key || !opToken || value === undefined) {
                throw new Error(`Invalid condition near '${key} ${opToken} ${value}'`);
            }
            // Handle quoted values
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }
            // Parse numeric values
            if (!isNaN(Number(value))) {
                value = Number(value);
            }
            // Handle IN and NOT IN operations
            if (opToken.toUpperCase() === "IN" || opToken.toUpperCase() === "NOT IN") {
                if (!value.startsWith("(") || !value.endsWith(")")) {
                    throw new Error(`Invalid syntax for '${opToken}' near '${value}'`);
                }
                value = value.slice(1, -1).split(",").map((v) => {
                    v = v.trim();
                    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
                        return v.slice(1, -1);
                    }
                    return isNaN(Number(v)) ? v : Number(v);
                });
            }
            // Map the operator to the query operators
            const mappedOp = operators[opToken.toUpperCase()];
            if (mappedOp !== undefined) {
                if (mappedOp === null) {
                    // "=" operator - direct assignment
                    current[key] = value;
                }
                else {
                    // Other operators - they go to the root level
                    if (!current[mappedOp]) {
                        current[mappedOp] = {};
                    }
                    current[mappedOp][key] = value;
                }
            }
            else {
                // If operator not found, default to direct assignment
                current[key] = value;
            }
        }
    }
    // Combine any remaining OR conditions
    if (stack.length > 0) {
        stack.push(current);
        return { $or: stack };
    }
    return current;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hlcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3FsL3doZXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sU0FBUyxHQUEyQjtJQUN0QyxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxLQUFLO0lBQ1YsR0FBRyxFQUFFLEtBQUs7SUFDVixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsS0FBSztJQUNYLFFBQVEsRUFBRSxNQUFNO0NBQ25CLENBQUM7QUFFRixTQUFTLFlBQVksQ0FBQyxNQUFtQixFQUFFLE1BQW1CO0lBQzFELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDdkIsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEIsMkNBQTJDO1lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsQ0FBQzthQUFNLENBQUM7WUFDSixpRkFBaUY7WUFDakYsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQzVCLGtFQUFrRTtnQkFDbEUsSUFBSSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ2pFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO3FCQUFNLENBQUM7b0JBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7aUJBQU0sQ0FB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