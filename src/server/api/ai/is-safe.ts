import { env } from "@/env";
import type { FlagType, RiskLevel } from "@prisma/client";

import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are analyzing the content of a Non-Disclosure Agreement (NDA).
Your task is to identify and flag only potentially risky clauses based on the policy rules below.
Return a JSON object with a key "safe" containing a boolean.

⚖️ Policy Rules:
- Indemnity clauses → Always unsafe
- Non-solicitation clauses: If they explicitly allow general or non-targeted hiring → Safe, otherwise → Unsafe
- Governing Law: If jurisdiction is not one of Delaware, New York, California, England and Wales, or Singapore → Unsafe
- Liquidated Damages clauses → Always Unsafe
- Confidentiality Term: If less than 2 years → Unsafe, otherwise → Safe

⚠️ Default behavior:
If uncertain about classification, default to: Unsafe. A more detailed analysis will be performed.
As soon as one clause is unsafe, the contract is unsafe and the "safe" key should be false. The analysis should stop immediately.
`;

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Check if the given raw text is safe. If it is, return true, otherwise return false.
 *
 * Could this increase false "safe" results?
 */
export async function checkIsSafe(rawText: string) {
	const response = await client.chat.completions.create({
		model: "gpt-5-nano",
		response_format: { type: "json_object" },
		messages: [
			{ role: "system", content: SYSTEM_PROMPT },
			{ role: "user", content: `Full NDA text:\n"""${rawText}"""` },
		],
	});

	const raw = response.choices[0]?.message?.content ?? "{}";
	console.log("Model output", raw);

	// TODO: Use Zod to parse the output
	let parsed: {
		safe: boolean;
	};

	try {
		parsed = JSON.parse(raw);
		console.log("Parsed model output", parsed);
	} catch (err) {
		console.error("Failed to parse model output", raw, err);
		throw new Error("Model output parsing failed");
	}

	return parsed.safe ?? false;
}
