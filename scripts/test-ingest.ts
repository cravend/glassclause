import { ingestContract } from "@/server/api/services/ingest-contract";
import { db } from "@/server/db";

async function main() {
	// 1. Pick an existing contract by id
	const contractId = process.argv[2]; // pass id as argument

	if (!contractId) {
		console.error("Usage: pnpm tsx scripts/test-analyze.ts <contractId>");
		process.exit(1);
	}

	// 2. Run the analyzer directly
	await ingestContract(contractId);

	// 3. Fetch updated contract with flagged clauses
	const contract = await db.contract.findUnique({
		where: { id: contractId },
		include: { flaggedClauses: true },
	});

	console.log(JSON.stringify(contract, null, 2));
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
