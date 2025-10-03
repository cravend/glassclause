"use client";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollArea,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import type { ContractDetails } from "@/types/prisma";
import type { Flag, RiskLevel } from "@prisma/client";
import { Flag as FlagIcon } from "lucide-react";
import { useMemo, useState } from "react";

function RiskBadge({ risk }: { risk: RiskLevel }) {
	return (
		<Badge
			variant="outline"
			className={
				risk === "Escalate"
					? "border-rose-500/20 bg-rose-500/10 text-rose-400"
					: "border-amber-500/20 bg-amber-500/10 text-amber-400"
			}
		>
			{risk}
		</Badge>
	);
}

export function IdentifiedFlagsBlock({
	contract,
	flags,
}: {
	contract: ContractDetails;
	flags: Flag[];
}) {
	const [search, setSearch] = useState("");

	console.log(flags);
	const filteredFlags = useMemo(() => {
		if (!search.trim()) return flags;
		const q = search.toLowerCase();
		return flags.filter(
			(f) =>
				f.type.toLowerCase().includes(q) ||
				f.risk.toLowerCase().includes(q) ||
				f.snippet.toLowerCase().includes(q),
		);
	}, [search, flags]);

	if (flags.length === 0) return null;
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2">
					<FlagIcon className="h-5 w-5 text-zinc-400" />
					Identified Flags
				</CardTitle>
				<CardDescription>
					Click a flag to jump to its location in the contract.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="relative">
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Filter flags…"
						className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-600"
					/>
				</div>
				<Separator />
				<ScrollArea className="h-[360px]">
					{filteredFlags.length === 0 ? (
						flags.length === 0 ? (
							<p className="text-sm text-zinc-400">No flags found.</p>
						) : (
							<p className="text-sm text-zinc-400">No flags match.</p>
						)
					) : (
						<ul className="space-y-3">
							{filteredFlags.map((f, i) => (
								<li
									key={f.id}
									className="rounded-lg border border-zinc-800 p-3"
								>
									<div className="mb-1 flex items-center justify-between gap-2">
										<div className="font-medium text-sm">{f.type}</div>
										<RiskBadge risk={f.risk} />
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={() => {
													const el = document.getElementById(`flag-${i}`);
													if (el)
														el.scrollIntoView({
															behavior: "smooth",
															block: "center",
														});
												}}
												className="block text-left text-xs text-zinc-400 hover:underline"
											>
												“{f.snippet}”
											</button>
										</TooltipTrigger>
										<TooltipContent side="bottom" className="max-w-xs text-xs">
											Jump to occurrence in the document
										</TooltipContent>
									</Tooltip>
								</li>
							))}
						</ul>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
