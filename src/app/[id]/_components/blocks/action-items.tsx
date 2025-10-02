import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import type { ContractDetails } from "@/types/prisma";
import { ClipboardList, Download, Shield } from "lucide-react";

export function ActionItemsBlock({
	contract,
}: {
	contract: ContractDetails;
}) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2">
					<ClipboardList className="h-5 w-5 text-zinc-400" />
					Action Items
				</CardTitle>
				<CardDescription>
					Actions should be taken after review of any flagged clauses in the
					contract.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex flex-wrap gap-2">
					<Button variant="secondary" className="gap-2">
						<Shield className="h-4 w-4" />
						Request Legal Review
					</Button>
					<Button variant="secondary" className="gap-2">
						<Download className="h-4 w-4" />
						Export Summary
					</Button>
					<Button variant="outline">Mark as Approved</Button>
					<Button variant="outline">Archive</Button>
				</div>
				<p className="mt-2 text-xs text-zinc-400">
					Tip: approving will store this outcome for retrieval on similar NDAs.
				</p>
			</CardContent>
		</Card>
	);
}
