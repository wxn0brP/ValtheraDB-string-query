import JSON5 from "json5";
class JsParser {
    parse(query) {
        const match = query.match(/^(\w+)\((.*)\)$/);
        if (!match)
            throw new Error("Invalid query");
        const [, method, argsStr] = match;
        let args = this.parseArgs(argsStr);
        return { method, args };
    }
    parseArgs(argsStr) {
        const args = [];
        let buffer = "";
        let bracketDepth = 0;
        for (let char of argsStr) {
            if (char === "{" || char === "[")
                bracketDepth++;
            if (char === "}" || char === "]")
                bracketDepth--;
            if (char === "," && bracketDepth === 0) {
                args.push(JSON5.parse(buffer.trim()));
                buffer = "";
            }
            else {
                buffer += char;
            }
        }
        if (buffer.trim())
            args.push(JSON5.parse(buffer.trim()));
        return args;
    }
}
export default JsParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRzFCLE1BQU0sUUFBUTtJQUNWLEtBQUssQ0FBQyxLQUFhO1FBQ2YsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3QyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRU8sU0FBUyxDQUFDLE9BQWU7UUFDN0IsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFFckIsS0FBSyxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUN2QixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxLQUFLLEdBQUc7Z0JBQUUsWUFBWSxFQUFFLENBQUM7WUFDakQsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHO2dCQUFFLFlBQVksRUFBRSxDQUFDO1lBRWpELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLENBQUM7aUJBQU0sQ0FBQztnQkFDSixNQUFNLElBQUksSUFBSSxDQUFDO1lBQ25CLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFekQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBRUQsZUFBZSxRQUFRLENBQUMifQ==