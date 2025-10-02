import { db } from "@/server/db";
import type { ContractStatus, FlagType, RiskLevel } from "@prisma/client";

import { analyzeFlags } from "../ai/analyze-flags";

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

	try {
		const contract = await db.contract.findUniqueOrThrow({
			where: { id: contractId },
		});

		const parsed = await analyzeFlags(contract.rawText);

		const flags = parsed.flags ?? [];

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

		await db.contract.update({
			where: { id: contract.id },
			data: {
				status: overallStatus,
				analysisStatus: "Succeeded",
				analysisError: null,
			},
		});
	} catch (err) {
		console.error("Analysis failed", err);
		await db.contract.update({
			where: { id: contractId },
			data: {
				status: "Failed",
				analysisStatus: "Failed",
				analysisError: String(err instanceof Error ? err.message : err),
			},
		});
	}
}
