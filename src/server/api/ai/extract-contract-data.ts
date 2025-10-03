import type { Simplify } from "type-fest";
import { client } from "./openai";

type ExtractedContract = Simplify<{
	title: string;
	date: string;
	clauses: {
		title: string;
		contents: string;
	}[];
}>;

export async function extractContractData(rawText: string) {
	const response = await client.responses.create({
		prompt: { id: "pmpt_68defe18d4188197ae4491913f70d36b0c7e19f82a284aa6" },
		input: [
			{
				role: "user",
				content:
					"Return a JSON object ONLY. Do not include any text outside of JSON.",
			},
			{ role: "user", content: rawText },
		],
		reasoning: {},
		store: true,
		include: ["reasoning.encrypted_content"],
	});

	const raw = response.output_text ?? "{}";

	let parsed: ExtractedContract;

	try {
		// Clean the response in case there's extra text
		const jsonMatch = raw.match(/\{[\s\S]*\}/);
		const jsonString = jsonMatch ? jsonMatch[0] : raw;

		parsed = JSON.parse(jsonString);

		// Validate the structure
		if (!parsed.title || !parsed.clauses || !Array.isArray(parsed.clauses)) {
			throw new Error("Invalid response structure");
		}

		// Validate each clause
		for (const clause of parsed.clauses) {
			if (!clause.title || !clause.contents) {
				throw new Error("Invalid clause structure");
			}
		}
	} catch (err) {
		console.error("Failed to parse model output", raw, err);
		throw new Error(
			`Model output parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
		);
	}

	return { data: parsed, conversationId: response.id };
}
