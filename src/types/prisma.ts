import { Prisma } from "@prisma/client";

export type {
	ContractStatus,
	AnalysisStatus,
	FlagType,
	RiskLevel,
} from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*  Helper: table row “select” for the UI’s Previous Contracts table          */
/* -------------------------------------------------------------------------- */

export const contractList = Prisma.validator<Prisma.ContractSelect>()({
	id: true,
	createdAt: true,
	updatedAt: true,
	status: true,
});

export type ContractList = Prisma.ContractGetPayload<{
	select: typeof contractList;
}>;
