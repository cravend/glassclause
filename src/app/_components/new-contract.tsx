"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useMemo, useState } from "react";

type Mode = "text" | "file";

export function NewContract() {
	const [mode, setMode] = useState<Mode>("text");
	const [text, setText] = useState("");
	const [file, setFile] = useState<File | null>(null);

	const utils = api.useUtils();
	const createContract = api.contract.create.useMutation({
		onSuccess: async () => {
			await utils.contract.invalidate();
			setText("");
			setFile(null);
		},
		onError: (err) => console.error(err),
	});

	const canSubmit = useMemo(() => {
		if (mode === "text")
			return text.trim().length > 0 && !createContract.isPending;
		// Upload UI is non-functional; disable submit for files for now.
		return false;
	}, [mode, text, createContract.isPending]);

	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-semibold text-2xl tracking-tight">New Contract</h2>
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-medium text-lg">Provide the contract</h2>
							<p className="text-muted-foreground text-sm">
								Paste the full text or upload a .pdf file.
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="text">Paste text</TabsTrigger>
							<TabsTrigger value="file">Upload file</TabsTrigger>
						</TabsList>

						<TabsContent value="text" className="mt-4">
							<Label htmlFor="contract-text" className="sr-only">
								Contract text
							</Label>
							<Textarea
								id="contract-text"
								placeholder="Paste contract text here…"
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="min-h-48"
							/>
						</TabsContent>

						<TabsContent value="file" className="mt-4">
							<div
								className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
								aria-live="polite"
							>
								<input
									id="contract-file"
									type="file"
									className="hidden"
									accept=".pdf,.md,.txt,application/pdf,text/plain,text/markdown"
									onChange={(e) => setFile(e.target.files?.[0] ?? null)}
								/>
								<Label
									htmlFor="contract-file"
									className="cursor-pointer rounded-md px-4 py-2 font-medium text-sm underline"
								>
									Choose a file
								</Label>
								<p className="mt-2 text-muted-foreground text-sm">
									{file ? `Selected: ${file.name}` : "PDF, Markdown, or Text"}
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>

				<CardFooter className="justify-between">
					<p className="text-muted-foreground text-xs">
						Submissions are queued for analysis. You’ll see status updates
						below.
					</p>
					<Button
						type="button"
						onClick={() => {
							// Only text mode is wired; file mode intentionally disabled for now.
							if (mode === "text") createContract.mutate({ text });
						}}
						disabled={!canSubmit}
					>
						{createContract.isPending ? "Submitting…" : "Send for analysis"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
