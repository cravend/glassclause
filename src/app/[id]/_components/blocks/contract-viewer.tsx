"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollArea,
	Separator,
	Tabs,
	TabsContent,
} from "@/components/ui";
import type { ContractDetails, FlaggedClause } from "@/types/prisma";
import { FileText } from "lucide-react";
import * as React from "react";

// Split text and wrap flagged ranges with anchors for click-to-scroll
function useHighlightedNodes(text: string, flags: FlaggedClause[]) {
	return React.useMemo(() => {
		if (!flags?.length) return [text];

		const ranges = [...flags]
			.sort((a, b) => a.start - b.start)
			.map(({ start, end }, i) => ({ start, end, id: `flag-${i}` }));

		const nodes: React.ReactNode[] = [];
		let cursor = 0;

		for (const r of ranges) {
			if (r.start > cursor) nodes.push(text.slice(cursor, r.start));
			nodes.push(
				<mark
					key={r.id}
					id={r.id}
					className="rounded bg-amber-500/20 px-1 py-0.5 ring-1 ring-amber-500/30"
				>
					{text.slice(r.start, r.end)}
				</mark>,
			);
			cursor = r.end;
		}
		if (cursor < text.length) nodes.push(text.slice(cursor));
		return nodes;
	}, [text, flags]);
}

export function ContractViewerBlock({
	contract,
}: {
	contract: ContractDetails;
}) {
	const highlighted = useHighlightedNodes(
		contract.rawText,
		contract.flaggedClauses,
	);

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5 text-zinc-400" />
					Contract Details
				</CardTitle>
				<CardDescription className="flex items-center gap-2 text-sm">
					{contract.updatedAt && (
						<span className="text-zinc-400">
							Updated{" "}
							{`${contract.updatedAt.toLocaleDateString()} ${contract.updatedAt.toLocaleTimeString()}`}
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent>
				<Tabs defaultValue="text">
					<TabsContent value="text" className="mt-0">
						<ScrollArea className="h-[68vh] rounded-md border border-zinc-800 p-4">
							<article className="prose prose-invert max-w-none">
								<p className="whitespace-pre-wrap leading-relaxed">
									{highlighted}
								</p>
							</article>
						</ScrollArea>
					</TabsContent>
					<TabsContent value="preview" className="mt-0">
						<div className="flex h-[68vh] items-center justify-center text-sm text-zinc-400">
							PDF rendering placeholder
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
