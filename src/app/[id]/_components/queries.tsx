"use client";

import { api } from "@/trpc/react";
import { ContractDetailPane } from "./details";

const REFRESH_INTERVAL = 2000;

export function DetailQueries({ id }: { id: string }) {
	const { data: contract, isSuccess } = api.contract.getById.useQuery(
		{ id },
		{
			refetchInterval: (ctx) => {
				return ctx.state?.data?.analysisStatus === "Running" ||
					ctx.state?.data?.analysisStatus === "Queued"
					? REFRESH_INTERVAL
					: false;
			},
		},
	);
	const { data: flags, isSuccess: flagsSuccess } =
		api.contract.getFlagsByContractId.useQuery(
			{ id },
			{
				refetchInterval: () => {
					return contract?.analysisStatus === "Running" ||
						contract?.analysisStatus === "Queued"
						? REFRESH_INTERVAL
						: false;
				},
			},
		);

	if (!isSuccess || !flagsSuccess) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-primary border-t-4 border-b-4" />
			</div>
		);
	}

	if (!contract) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<div className="text-sm text-zinc-400">Contract not found</div>
			</div>
		);
	}

	return <ContractDetailPane contract={contract} flags={flags} />;
}
