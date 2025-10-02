import { StatusBadge } from "@/components/status-badge";
import { Button, Separator } from "@/components/ui";
import type { ContractDetails } from "@/types/prisma";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import {
	ActionItemsBlock,
	ContractViewerBlock,
	IdentifiedFlagsBlock,
	StatusSummaryBlock,
} from "./blocks";

export function ContractDetailPane({
	contract,
}: {
	contract: ContractDetails;
}) {
	return (
		<main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" className="gap-2" asChild>
						<Link href="/">
							<ArrowLeft className="h-4 w-4" />
							Home
						</Link>
					</Button>
					<Separator orientation="vertical" className="h-6" />
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-zinc-400" />
						<h1 className="font-semibold text-lg tracking-tight">
							Contract #{contract.id}
						</h1>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge status={contract.status} />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<div className="space-y-6 lg:col-span-4">
					<IdentifiedFlagsBlock contract={contract} />
					<ActionItemsBlock contract={contract} />
				</div>

				<div className="lg:col-span-8">
					<StatusSummaryBlock contract={contract} />
					<ContractViewerBlock contract={contract} />
				</div>
			</div>
		</main>
	);
}
