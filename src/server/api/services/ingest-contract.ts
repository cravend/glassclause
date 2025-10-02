import { db } from "@/server/db";
import type { ContractStatus, FlagType, RiskLevel } from "@prisma/client";

import { analyzeClause } from "../ai/analyze-clause";
import { extractContractData } from "../ai/extract-contract-data";
import { checkIsSafe } from "../ai/is-safe";

function deriveContractStatus(
	risks: (RiskLevel | undefined)[],
): ContractStatus {
	if (risks.includes("Escalate")) return "Escalate";
	if (risks.includes("Caution")) return "Caution";
	return "Safe";
}

/**
 * Run analysis for a single contract in the background.
 */
export async function ingestContract(contractId: string) {
	const contract = await db.contract.findUnique({
		where: { id: contractId },
	});

	if (!contract || contract.analysisStatus !== "Queued") {
		console.log(
			`Contract ${contractId} not found or already analyzed`,
			contract,
		);
		return;
	}

	await db.contract.update({
		where: { id: contractId },
		data: { analysisStatus: "Running" },
	});

	// First, do a quick check if the contract is safe. If it is, we can skip the rest of the analysis.
	// Note: we might be able to remove this because of the new clause extraction
	try {
		const safe = await checkIsSafe(contract.rawText);

		if (safe) {
			return db.contract.update({
				where: { id: contract.id },
				data: {
					status: "Safe",
					analysisStatus: "Succeeded",
					analysisError: null,
				},
			});
		}
		// If the contract is not safe, we need to analyze the clauses. We can tell
		// the UI that the analysis is running but that we know it's unsafe.
		await db.contract.update({
			where: { id: contract.id },
			data: { status: "Unsafe" },
		});
	} catch (err) {
		console.error("Safe check failed", err);
		return db.contract.update({
			where: { id: contractId },
			data: {
				status: "Failed",
				analysisStatus: "Failed",
				analysisError: String(err instanceof Error ? err.message : err),
			},
		});
	}

	// If the contract is identified as not safe, we need to analyze in detail the clauses.
	// First, we'll get the clauses.
	try {
		const contract = await db.contract.findUniqueOrThrow({
			where: { id: contractId },
		});

		const { data: contractData } = await extractContractData(contract.rawText);
		await db.contract.update({
			where: { id: contractId },
			data: {
				title: contractData.title,
				contractDate: contractData.date,
			},
		});

		const { count } = await db.clause.createMany({
			data: contractData.clauses.map((c) => ({
				contractId: contract.id,
				title: c.title,
				contents: c.contents,
			})),
		});
		console.log(`Created ${count} clauses`);
	} catch (err) {
		console.error("Clause extraction failed", err);
		return db.contract.update({
			where: { id: contractId },
			data: {
				status: "Failed",
				analysisStatus: "Failed",
				analysisError: String(err instanceof Error ? err.message : err),
			},
		});
	}

	// Now, we'll analyze the clauses. We can do this in parallel to speed up the process.
	try {
		const clauses = await db.clause.findMany({
			where: { contractId: contract.id },
		});

		const promises = clauses.map(async (clause) => {
			console.log(`Analyzing clause ${clause.id}`);
			const flags = await analyzeClause(clause.contents);
			if (!flags.length) return;
			console.log(`Found ${flags.length} flags for clause ${clause.id}`);
			return db.flag.createMany({
				data: flags.map((flag) => ({
					clauseId: clause.id,
					type: flag.type,
					snippet: flag.snippet,
					start: flag.start,
					end: flag.end,
					risk: flag.risk,
				})),
			});
		});

		await Promise.all(promises);

		const flags = await db.flag.findMany({
			where: { clauseId: { in: clauses.map((c) => c.id) } },
		});

		// Derive overall status
		const risks = flags.map((c) => c.risk);
		const overallStatus = deriveContractStatus(risks);

		return db.contract.update({
			where: { id: contract.id },
			data: {
				status: overallStatus,
				analysisStatus: "Succeeded",
				analysisError: null,
			},
		});
	} catch (err) {
		console.error("Flagged clause analysis failed", err);
		return db.contract.update({
			where: { id: contractId },
			data: {
				status: "Failed",
				analysisStatus: "Failed",
				analysisError: String(err instanceof Error ? err.message : err),
			},
		});
	}
}
