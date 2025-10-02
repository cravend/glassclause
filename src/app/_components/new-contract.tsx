"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

export function NewContract() {
	const utils = api.useUtils();
	const [text, setText] = useState("");
	const createContract = api.contract.create.useMutation({
		onSuccess: async () => {
			await utils.contract.invalidate();
			setText("");
		},
		onError: (error) => {
			console.error(error);
		},
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createContract.mutate({ text });
				}}
				className="flex flex-col gap-2"
			>
				<Card>
					<CardContent>
						<Textarea
							placeholder="Paste contract here..."
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={createContract.isPending}>
							{createContract.isPending ? "Sending..." : "Scan"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
