import type { FlagType, RiskLevel } from "@prisma/client";
import { client } from "./openai";

/**
 * Analyze the flags in the given clause using OpenAI
 */
export async function analyzeClause(rawText: string) {
	const response = await client.responses.create({
		prompt: { id: "pmpt_68df123849e88194b074a9e30a8dff240e77408efa02609a" },
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

	// TODO: Use Zod to parse the output
	let parsed: {
		flags: {
			type: FlagType;
			risk: RiskLevel;
			snippet: string;
			start: number;
			end: number;
		}[];
	};

	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		console.error("Failed to parse clause output", raw, err);
		throw new Error("Clause output parsing failed");
	}

	const flags = parsed.flags ?? [];
	return flags.filter((f) => f.type !== "Other");
}
