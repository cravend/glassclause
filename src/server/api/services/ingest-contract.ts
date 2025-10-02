import { db } from "@/server/db";
import type { ContractStatus, FlagType, RiskLevel } from "@prisma/client";

import { analyzeFlags } from "../ai/analyze-flags";
import { checkIsSafe } from "../ai/is-safe";

function deriveContractStatus(risks: RiskLevel[]): ContractStatus {
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
	try {
		const contract = await db.contract.findUniqueOrThrow({
			where: { id: contractId },
		});

		const flags = await analyzeFlags(contract.rawText);

		// Insert flagged clauses
		if (flags.length) {
			await db.flaggedClause.createMany({
				data: flags.map((f) => ({
					contractId: contract.id,
					type: f.type,
					risk: f.risk,
					snippet: f.snippet,
					start: f.start,
					end: f.end,
				})),
			});
		}

		// Derive overall status
		const risks = flags.map((f) => f.risk);
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
