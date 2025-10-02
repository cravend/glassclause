"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import type { ContractDetails } from "@/types/prisma";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export function StatusSummaryBlock({
	contract,
}: {
	contract: ContractDetails;
}) {
	return (
		<>
			{contract.status === "Safe" && (
				<Alert className="mb-4 border-emerald-500/30 bg-emerald-500/10">
					<CheckCircle2 className="h-4 w-4" />
					<AlertTitle className="text-emerald-400">
						No issues detected
					</AlertTitle>
					<AlertDescription className="text-emerald-200/90">
						You can proceed or request a quick legal pass.
					</AlertDescription>
				</Alert>
			)}

			{/* If the overall status is risky, surface a simple summary */}
			{(contract.status === "Caution" || contract.status === "Escalate") && (
				<Alert className="mb-4 border-rose-500/30 bg-rose-500/10">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle className="text-rose-400">
						{contract.status === "Escalate" ? "Escalation required" : "Caution"}
					</AlertTitle>
					<AlertDescription className="text-rose-200/90">
						Review the flagged clauses on the left and route for legal review if
						needed.
					</AlertDescription>
				</Alert>
			)}
			{/* If the contract is unsafe, alert the user that processing is still happening */}
			{contract.status === "Unsafe" && (
				<Alert className="mb-4 border-amber-500/30 bg-amber-500/10">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle className="text-amber-400">
						{"Attention required"}
					</AlertTitle>
					<AlertDescription className="text-amber-200/90">
						This contract is still being processed, but initial results indicate
						high risk. Please review the contract manually and await final
						processing.
					</AlertDescription>
				</Alert>
			)}
			{contract.status === "Processing" && (
				<Alert className="border-sky-500/30 bg-sky-500/10">
					<Loader2 className="h-4 w-4 animate-spin" />
					<AlertTitle className="text-sky-400">
						Processing in progress
					</AlertTitle>
					<AlertDescription className="text-sky-200/90">
						We've ingested the document and are reviewing it for potential
						flags. The view will update as analysis completes.
					</AlertDescription>
				</Alert>
			)}
		</>
	);
}
