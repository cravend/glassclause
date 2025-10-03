import { type Clause, Prisma } from "@prisma/client";

export type {
	ContractStatus,
	AnalysisStatus,
	FlagType,
	RiskLevel,
	Contract,
	Clause,
	Flag,
} from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*  Helper: table row “select” for the UI’s Previous Contracts table          */
/* -------------------------------------------------------------------------- */

export const contractList = Prisma.validator<Prisma.ContractSelect>()({
	id: true,
	createdAt: true,
	updatedAt: true,
	contractDate: true,
	status: true,
	analysisStatus: true,
});

export type ContractList = Prisma.ContractGetPayload<{
	select: typeof contractList;
}>;

export type ContractDetails = Prisma.ContractGetPayload<{
	include: { clauses: true };
}>;
