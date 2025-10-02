import { Badge } from "@/components/ui";
import type { ContractStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: ContractStatus }) {
	const map: Record<ContractStatus, { label: string; className: string }> = {
		Processing: {
			label: "Processing",
			className: "bg-sky-500/10 text-sky-400 border-sky-500/20",
		},
		Unsafe: {
			label: "Processing (partial)",
			className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		},
		Safe: {
			label: "Safe",
			className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
		},
		Caution: {
			label: "Caution",
			className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		},
		Escalate: {
			label: "Escalate",
			className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
		},
		Failed: {
			label: "Failed",
			className: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
		},
	};
	const { label, className } = map[status];
	return (
		<Badge variant="outline" className={className}>
			{label}
		</Badge>
	);
}
