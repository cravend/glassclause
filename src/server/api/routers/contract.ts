import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contractList } from "@/types/prisma";

export const contractRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			console.log("Creating contract", input);
			return ctx.db.contract.create({ data: { rawText: input.text } });
		}),
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.contract.findMany({ select: contractList });
	}),
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.contract.findUnique({ where: { id: input.id } });
		}),
});
