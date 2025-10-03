import { client } from "./openai";

/**
 * Check if the given raw text is safe. If it is, return true, otherwise return false.
 *
 * Could this increase false "safe" results?
 */
export async function checkIsSafe(rawText: string) {
	const response = await client.responses.create({
		prompt: { id: "pmpt_68df11a01af481909bcc0379890b3a4d080433d91ca170f1" },
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
