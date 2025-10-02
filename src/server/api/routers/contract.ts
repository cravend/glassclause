import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contractList } from "@/types/prisma";
import { ingestContract } from "../services/ingest-contract";

export const contractRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const contract = await ctx.db.contract.create({
				data: { rawText: input.text },
			});

			// Ingest the contract in the background
			void ingestContract(contract.id);

			return contract;
		}),
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.contract.findMany({
			select: contractList,
			orderBy: { createdAt: "desc" },
		});
	}),
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.contract.findUnique({ where: { id: input.id } });
		}),
});
