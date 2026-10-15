# ValtheraDB Query Processor

`@wxn0brp/db-string-query` parses SQL-like strings into ValtheraDB commands. It
covers a practical subset of SQL, not full SQL.

## Installation

```bash
npm install @wxn0brp/db-string-query
```

`@wxn0brp/db-core` is an optional peer dependency that provides the query types.

## Usage

```typescript
import { ValtheraDbParsers } from "@wxn0brp/db-string-query";

const sqlParser = new ValtheraDbParsers.sql();

const parsedQuery = sqlParser.parse("SELECT * FROM users WHERE id = 1");
// {
//   method: 'find',
//   query: { collection: 'users', search: { id: 1 }, findOpts: {}, dbFindOpts: {} }
// }
```

`parse(query, opts?)` returns `{ method, query, relation? }`. `method` names the
ValtheraDB method and `query` is its argument, for example
`db.find(parsedQuery.query)`.

## Commands

| SQL command                  | ValtheraDB method                    |
| ---------------------------- | ------------------------------------ |
| `SELECT`                     | `find` (`count` for `COUNT(*)`)      |
| `SELECT ... JOIN`            | `relation-find`                      |
| `INSERT`                     | `add` / `bulkAdd`                    |
| `INSERT ... ON DUPLICATE KEY` | `updateOneOrAdd` / `toggleOne`      |
| `UPDATE`                     | `update`                             |
| `DELETE`                     | `remove`                             |
| `GET COLLECTIONS`            | `getCollections`                     |
| `CREATE TABLE`               | `ensureCollection`                   |
| `DROP TABLE`                 | `removeCollection`                   |
| `EXISTS TABLE`               | `issetCollection`                    |
| `CREATE INDEX`               | `createIndex`                        |
| `DROP INDEX`                 | `removeIndex`                        |

`TABLE` and `COLLECTION` are synonyms, as are `IF NOT EXISTS` and `IF EXISTS`.
A trailing `;` is stripped.

## SELECT

```sql
SELECT name, email FROM users WHERE active = 1 ORDER BY name DESC LIMIT 10 OFFSET 20
```

-   Projection: `*`, a column list, or `* EXCLUDE a, b`.
-   WHERE: `=`, `<`, `>`, `<=`, `>=`, `!=`/`<>`, `IN`/`NOT IN`/`NOT ANY`,
    `IS [NOT] NULL`, `LIKE`/`ILIKE` (with `%` and `_`), `BETWEEN`, plus `AND`,
    `OR` and parentheses.
-   `ORDER BY field [ASC|DESC]` or `ORDER BY random()`, `GROUP BY field[, ...]`,
    `LIMIT n`, `OFFSET n`, `REVERSE`.
-   Aggregates `MIN`, `MAX`, `AVG`, `COUNT` with an optional `AS alias`. Without
    one the parser derives the alias (`min_age`, ...).
-   `COUNT(*)` must be used alone and maps to the `count` method.

Projection goes to `query.findOpts`; sorting, paging, grouping and aggregates go
to `query.dbFindOpts`.

### JOIN

When `opts.defaultDbKey` is set, a `JOIN ... ON` query resolves to
`relation-find`, with `[path, search, relations, findOpts, dbFindOpts]` in
`relation`. Without `defaultDbKey` the JOIN is ignored and a plain `find` is
returned.

```typescript
sqlParser.parse(
	"SELECT posts.*, users.name FROM posts JOIN users ON posts.userId = users.id WHERE posts.id = 1",
	{ defaultDbKey: "db" },
);
```

`tableDbMap` points joined tables at different databases:

```typescript
sqlParser.parse(query, {
	defaultDbKey: "defaultDb",
	tableDbMap: { comments: "blogDb" },
});
```

## INSERT, UPDATE, DELETE

```sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com')
INSERT INTO users (name, age) VALUES ('A', 1), ('B', 2)   -- bulkAdd
UPDATE users SET name = 'John' WHERE id = 1
DELETE FROM users WHERE id = 1
```

Multiple rows map to `bulkAdd`. `ON DUPLICATE KEY UPDATE ...` maps to
`updateOneOrAdd` and `ON DUPLICATE KEY DELETE` to `toggleOne`; both need exactly
one row. `UPDATE` requires `WHERE`, and `DELETE` without `WHERE` clears the
collection. Values may be single or double quoted, and numeric literals become
numbers.

## Collections and indexes

```sql
CREATE TABLE IF NOT EXISTS users
DROP TABLE IF EXISTS users
EXISTS TABLE users
CREATE UNIQUE INDEX IF NOT EXISTS uq ON users (email, age)
DROP INDEX uq ON users (email, age)
```

Index names may be wrapped in backticks; fields may use `/` for paths.

## Options

```typescript
interface Opts {
	defaultDbKey: string;
	tableDbMap?: Record<string, string>;
}
```

`defaultDbKey` is required to build relations for JOIN queries. `tableDbMap` maps
a table to the database key it lives in, falling back to `defaultDbKey`.

## Errors

Invalid input throws an `Error` with a descriptive message. Unknown commands
suggest the closest match, for example
`Unknown SQL command 'SELECTT'. Did you mean 'SELECT'?`.

## License

MIT. See [LICENSE](LICENSE).
