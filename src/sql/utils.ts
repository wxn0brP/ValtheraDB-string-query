import { ValtheraQuery } from "../types";


export function parseReturn(method: string, args: any[]): ValtheraQuery {
    return { method, args };
}

export function parseSet(setString: string) {
    return Object.fromEntries(
        setString.split(/\s*,\s*/).map(pair => {
            const [key, value]: any = pair.split(/\s*=\s*/);
            let parsedValue = value.replace(/^'|'$/g, "");
            if (!isNaN(parsedValue)) parsedValue = Number(parsedValue);
            return [key, parsedValue];
        })
    );
}