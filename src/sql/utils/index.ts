import { VQuery } from "@wxn0brp/db-core/types/query";
import { ValtheraQuery } from "../../types";

export function parseReturn(method: string, collection: string = "", query: VQuery = {}): ValtheraQuery {
    if (collection) query.collection = collection;
    return { method, query };
}

export function parseSet(setString: string) {
    return Object.fromEntries(
        setString.split(/\s*,\s*/).map(pair => {
            const [key, value]: any = pair.split(/\s*=\s*/);
            let parsedValue: any = value;
            if (!isNaN(+value)) parsedValue = +value;
            else parsedValue = removeQuotes(value);

            return [removeQuotes(key), parsedValue];
        })
    );
}

export function removeQuotes(str: string) {
    return str.replace(/^['"`]|['"`]$/g, "");
}

export function parseNum(str: string) {
    return isNaN(+str) ? str : +str;
}
