import { extractContractData } from "@/server/api/ai/extract-contract-data";
import { checkIsSafe } from "@/server/api/ai/is-safe";
import { db } from "@/server/db";

async function main() {
	// 1. Pick an existing contract by id
	const contractId = process.argv[2]; // pass id as argument

	if (!contractId) {
		console.error("Usage: pnpm tsx scripts/test-analyze.ts <contractId>");
		process.exit(1);
	}

	const contractText = await db.contract.findUnique({
		where: { id: contractId },
		select: { rawText: true },
	});

	if (!contractText?.rawText) {
		console.error("Contract text not found");
		process.exit(1);
	}

	// 2. Run the analyzer directly
	const res = await extractContractData(contractText.rawText);

	console.log(res);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
