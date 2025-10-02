import { Separator } from "@/components/ui/separator";
import { ContractsTable } from "./_components/contracts-table";
import { NewContract } from "./_components/new-contract";

export default async function Home() {
	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-8 py-12">
			<h2 className="font-bold text-2xl">Process Contract</h2>
			<NewContract />
			<Separator />
			<div>
				<h2 className="pb-4 font-bold text-2xl">Previous Contracts</h2>
				<ContractsTable />
			</div>
		</main>
	);
}
