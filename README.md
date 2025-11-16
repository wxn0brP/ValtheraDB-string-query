# ValtheraDB Query Processor

`@wxn0brp/db-string-query` is a powerful query processor for ValtheraDB. It allows you to parse database queries written in either a JavaScript-like syntax or a SQL-like syntax. This provides flexibility in how you interact with your database.

## Features

-   **Dual Syntax Support**: Write queries in either JS-like or SQL-like syntax.
-   **Extensible**: Easily extendable with new methods and handlers.
-   **Typed**: Written in TypeScript for type safety.

## Installation

```bash
npm install @wxn0brp/db-string-query
```

## Usage

The library exports a `ValtheraDbParsers` object which contains the `js` and `sql` parsers.

### JS-like Syntax

The JS-like syntax is similar to calling a function. The query string should be in the format `method(arg1, arg2, ...)`. Arguments are parsed using `JSON5`, so you can pass complex objects.

```typescript
import { ValtheraDbParsers } from "@wxn0brp/db-string-query";

const jsParser = new ValtheraDbParsers.js();

const query = `myMethod({ a: 1, b: "hello" }, [1, 2, 3])`;
const parsedQuery = jsParser.parse(query);

console.log(parsedQuery);
// Output:
// {
//   method: 'myMethod',
//   args: [ { a: 1, b: 'hello' }, [ 1, 2, 3 ] ]
// }
```

### SQL-like Syntax

The SQL-like syntax provides a familiar way to interact with the database. 

> Note: The SQL-like syntax is not full SQL. It is a simplified subset, supporting only basic, straightforward cases.

```typescript
import { ValtheraDbParsers } from "@wxn0brp/db-string-query";

const sqlParser = new ValtheraDbParsers.sql();

const query = "SELECT * FROM users WHERE id = 1";
const parsedQuery = sqlParser.parse(query);

console.log(parsedQuery);
```

#### Supported SQL Commands

The SQL parser supports the following commands:

-   `SELECT`: Retrieve data from a collection.
-   `INSERT`: Add new data to a collection.
-   `UPDATE`: Modify existing data in a collection.
-   `DELETE`: Remove data from a collection.
-   `GET COLLECTIONS`: Get list of collection.
-   `CREATE`: Create a new collection.
-   `DROP`: Delete a collection.
-   `EXISTS`: Check if a collection exists.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
