import { env } from "@/env";

import OpenAI from "openai";

export const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
