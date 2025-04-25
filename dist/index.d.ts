import valtheraJsParser from "./js.js";
import valtheraSQLParser from "./sql/index.js";
declare const ValtheraDbParsers: {
    js: typeof valtheraJsParser;
    sql: typeof valtheraSQLParser;
};
declare const ValtheraDbRelations: {};
export { ValtheraDbParsers, ValtheraDbRelations };
