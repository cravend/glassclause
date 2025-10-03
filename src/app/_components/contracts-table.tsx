"use client";

import { StatusBadge } from "@/components/status-badge";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import Link from "next/link";

export function ContractsTable() {
	const query = api.contract.getAll.useQuery(undefined, {
		refetchInterval: (ctx) => {
			const anyProcessing = ctx.state.data?.some(
				(c) => c.status === "Processing" || c.status === "Unsafe",
			);
			return anyProcessing ? 4000 : false;
		},
	});

	const data = query.data ?? [];
	const isEmpty = !query.isLoading && data.length === 0;

	return (
		<section>
			<div className="mb-2 flex items-center justify-between">
				<h2 className="font-semibold text-2xl tracking-tight">
					Previous Contracts
				</h2>
				{data.some(
					(c) => c.status === "Processing" || c.status === "Unsafe",
				) && (
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
						<span>Processing in progress…</span>
					</div>
				)}
			</div>

			<Table>
				{isEmpty && (
					<TableCaption className="text-muted-foreground">
						No contracts yet. Submit one above to begin analysis.
					</TableCaption>
				)}
				<TableHeader>
					<TableRow>
						<TableHead className="w-[180px]">Contract</TableHead>
						<TableHead>Contract Date</TableHead>
						<TableHead>Uploaded At</TableHead>
						<TableHead>Processed At</TableHead>
						<TableHead className="text-right">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((contract) => (
						<TableRow key={contract.id}>
							<TableCell className="font-medium">
								<Link
									className="underline underline-offset-4"
									href={`/${contract.id}`}
								>
									{shortId(contract.id)}
								</Link>
							</TableCell>
							<TableCell>
								{/* Time constraint: because of the `isSafe` check, we don't extract this date for safe contracts :-( */}
								{contract.contractDate
									? new Date(contract.contractDate).toLocaleDateString()
									: "---"}
							</TableCell>
							<TableCell>
								{`${contract.createdAt.toLocaleDateString()} ${contract.createdAt.toLocaleTimeString()}`}
							</TableCell>
							<TableCell>
								{Math.floor(contract.updatedAt.getTime() / 1000) ===
									Math.floor(contract.createdAt.getTime() / 1000) ||
								contract.status === "Processing"
									? "---"
									: `${contract.updatedAt.toLocaleDateString()} ${contract.updatedAt.toLocaleTimeString()}`}
							</TableCell>
							<TableCell className="text-right">
								<StatusBadge status={contract.status} />
							</TableCell>
						</TableRow>
					))}
					{query.isLoading &&
						[0, 1, 2, 3, 4].map((i) => (
							<TableRow
								key={`skeleton-${i}`}
								className="font-medium text-muted-foreground"
							>
								<TableCell className="animate-pulse">Loading…</TableCell>
								<TableCell>—</TableCell>
								<TableCell>—</TableCell>
								<TableCell>—</TableCell>
								<TableCell className="text-right">—</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</section>
	);
}

function shortId(id: string) {
	return id.length <= 12 ? id : `${id.slice(0, 6)}…${id.slice(-4)}`;
}
