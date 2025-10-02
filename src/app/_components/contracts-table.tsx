"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";

import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

export function ContractsTable() {
	const { data, isLoading, isSuccess } = api.contract.getAll.useQuery(
		undefined,
		{
			refetchInterval: (data) => {
				const hasProcessingContracts = data.state.data?.some(
					(contract) => contract.status === "Processing",
				);
				console.log(hasProcessingContracts);
				return hasProcessingContracts ? 5000 : false;
			},
		},
	);

	const hasData = isSuccess && data.length > 0;
	const processingContracts = data?.filter(
		(contract) => contract.status === "Processing",
	);

	return (
		<div>
			<div className="flex items-center gap-4">
				<h2 className="font-bold text-2xl">Previous Contracts</h2>
				{!!processingContracts?.length && (
					<div className="flex h-fit items-center gap-2 text-muted-foreground text-sm">
						<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
						<span>
							Processing {processingContracts.length}{" "}
							{processingContracts.length === 1 ? "contract" : "contracts"}...
						</span>
					</div>
				)}
			</div>
			<div className="space-y-4">
				<Table>
					{hasData ? null : (
						<TableCaption>
							{isLoading ? (
								<div className="flex flex-col items-center justify-center text-center">
									<div className="mx-auto h-12 w-12 text-muted-foreground">
										<h3 className="mt-4 font-semibold text-lg">Loading...</h3>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<div className="mx-auto h-12 w-12 text-muted-foreground">
										<svg
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<title>No contracts yet</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<h3 className="mt-4 font-semibold text-lg">
										No contracts yet
									</h3>
									<p className="mt-2 text-muted-foreground text-sm">
										Upload your first contract to get started with analysis.
									</p>
								</div>
							)}
						</TableCaption>
					)}
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>Contract Date</TableHead>
							<TableHead>Upload Date</TableHead>
							<TableHead className="text-right">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((contract) => (
							<TableRow key={contract.id}>
								{/* This is temporary, I should use better titles */}
								<TableCell className="font-medium">
									<Link href={`/${contract.id}`}>{contract.id}</Link>
								</TableCell>
								<TableCell>---</TableCell>
								<TableCell>{contract.createdAt.toLocaleDateString()}</TableCell>
								<TableCell className="text-right">
									<StatusBadge status={contract.status} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
