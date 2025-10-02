import { env } from "@/env";
import type { FlagType, RiskLevel } from "@prisma/client";

import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are analyzing the content of a Non-Disclosure Agreement (NDA).
Your task is to identify and flag only potentially risky clauses based on the policy rules below.
Return a JSON object with a key "flags" containing an array of objects.
Each object must include:
- type: one of ["Indemnity", "NonSolicitation", "GoverningLaw", "LiquidatedDamages", "Other"]
- risk: one of ["Caution", "Escalate"]
- snippet: the shortest possible verbatim text span from the NDA justifying the flag
- start: character offset (0-based) of the snippet's start position in the full NDA text
- end: character offset (exclusive) of the snippet's end position in the full NDA text

⚖️ Policy Rules:
- Indemnity clauses → Always Escalate
- Non-solicitation clauses: If they explicitly allow general or non-targeted hiring → Do not flag, otherwise → Escalate
- Governing Law: If jurisdiction is not one of Delaware, New York, California, England and Wales, or Singapore → Escalate
- Liquidated Damages clauses → Always Escalate
- Confidentiality Term: If less than 2 years → Caution, otherwise → Do not flag

⚠️ Default behavior:
If uncertain about classification, default to: type: "Other", risk: "Escalate"
If no clause justifies a flag, return an empty array for "flags".
`;

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Analyze the flags in the given clause using OpenAI
 */
export async function analyzeClause(rawText: string) {
	const response = await client.chat.completions.create({
		model: "gpt-5-mini",
		response_format: { type: "json_object" },
		messages: [
			{ role: "system", content: SYSTEM_PROMPT },
			{ role: "user", content: rawText },
		],
	});

	const raw = response.choices[0]?.message?.content ?? "{}";

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
