import {
	COLLECTION_SRC,
	parseReturn,
	parseSet,
	stripIdentQuotes,
} from "#sql/utils";
import { parseWhere } from "#sql/where";

export function handleUpdate(query: string) {
	const match = query.match(
		new RegExp(
			`UPDATE\\s+(${COLLECTION_SRC})\\s+SET\\s+(.+)\\s+WHERE\\s+(.+)`,
			"i",
		),
	);
	if (!match) throw new Error("Invalid UPDATE syntax");

	const collection = stripIdentQuotes(match[1]);
	const setClause = parseSet(match[2]);
	const whereClause = parseWhere(match[3]);

	return parseReturn("update", collection, {
		search: whereClause,
		updater: setClause,
	});
}
