import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import type { ContractDetails } from "@/types/prisma";
import {
	AlertTriangle,
	Archive,
	Check,
	ClipboardList,
	Download,
	FileWarning,
	Shield,
} from "lucide-react";

function SafeActions() {
	return (
		<div className="flex flex-col gap-2 lg:items-start">
			<Button variant="default" className="gap-2">
				<Check className="h-4 w-4" />
				Mark as Approved
			</Button>
			<Button variant="secondary" className="gap-2">
				<Shield className="h-4 w-4" />
				Request Legal Review
			</Button>
			<Button variant="secondary" className="gap-2">
				<Archive className="h-4 w-4" />
				Archive
			</Button>
			<Button variant="secondary" className="gap-2">
				<Download className="h-4 w-4" />
				Export Summary
			</Button>
		</div>
	);
}

function UnsafeActions({ disabled }: { disabled: boolean }) {
	return (
		<div className="flex flex-col gap-2 lg:items-start">
			<Button variant="destructive" className="gap-2" disabled={disabled}>
				<AlertTriangle className="h-4 w-4" />
				Mark as Approved
			</Button>
			<Button variant="secondary" className="gap-2" disabled={disabled}>
				<Shield className="h-4 w-4" />
				Request Legal Review
			</Button>
			<Button variant="secondary" className="gap-2" disabled={disabled}>
				<Archive className="h-4 w-4" />
				Archive
			</Button>
			<Button variant="secondary" className="gap-2" disabled={disabled}>
				<Download className="h-4 w-4" />
				Export Summary
			</Button>
		</div>
	);
}

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
				{contract.status === "Safe" ? (
					<SafeActions />
				) : (
					<UnsafeActions disabled={contract.status === "Unsafe"} />
				)}
				<p className="mt-2 text-xs text-zinc-400">
					Tip: approving will store this outcome for retrieval on similar NDAs.
				</p>
			</CardContent>
		</Card>
	);
}
