type QueryObject = Record<string, any>;

const operators: Record<string, string> = {
    "=": "",
    "<": "$lt",
    ">": "$gt",
    "<=": "$lte",
    ">=": "$gte",
    "!=": "$not",
    "IN": "$in",
    "NOT IN": "$nin"
};

export function parseWhere(where: string): QueryObject {
    if (!where) return {};
    const trimmed = where.trim();
    if (trimmed === "" || trimmed === "1") return {};

    // Tokenize the input string, handling parentheses and quoted values
    const tokens = where
        .replace(/\s+(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/g, " ")
        .match(/(?:\(|\)|'[^']*'|"[^"]*"|[^\s()'"]+)/g) || [];

    let frames: Array<{ current: QueryObject, operatorStack: string[], stack: any[] }> = [];
    let current: QueryObject = {};
    let operatorStack: string[] = [];
    let stack: any[] = [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i].trim();
        if (!token) continue;

        if (token === '(') {
            // Push current context to the stack and reset for the new group
            frames.push({ current, operatorStack, stack });
            current = {};
            operatorStack = [];
            stack = [];
        } else if (token === ')') {
            // Combine current and stack into a grouped query
            let groupedQuery: QueryObject = current;
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
                } else if (op === "AND") {
                    current = { ...parentCurrent, ...groupedQuery };
                }
            } else {
                current = { ...parentCurrent, ...groupedQuery };
            }

            // Restore parent's stack and operator stack
            operatorStack = parentFrame.operatorStack;
            stack = parentStack;
        } else if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
            operatorStack.push(token.toUpperCase());
        } else {
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
            let op = tokens[++i]?.trim();
            let value: any = tokens[++i]?.trim();

            if (!key || !op || value === undefined) {
                throw new Error(`Invalid condition near '${key} ${op} ${value}'`);
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
            if (op.toUpperCase() === "IN" || op.toUpperCase() === "NOT IN") {
                if (!value.startsWith("(") || !value.endsWith(")")) {
                    throw new Error(`Invalid syntax for '${op}' near '${value}'`);
                }
                value = value.slice(1, -1).split(",").map((v: string) => {
                    v = v.trim();
                    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
                        return v.slice(1, -1);
                    }
                    return isNaN(Number(v)) ? v : Number(v);
                });
            }

            // Map the operator to MongoDB's query operators
            const mappedOp = operators[op.toUpperCase()] || "";
            if (mappedOp) {
                if (mappedOp === "$not") {
                    current[key] = { [mappedOp]: value };
                } else {
                    current[key] = current[key] || {};
                    (current[key] as Record<string, any>)[mappedOp] = value;
                }
            } else {
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