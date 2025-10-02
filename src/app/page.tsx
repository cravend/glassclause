import { Separator } from "@/components/ui/separator";
import { ContractsTable } from "./_components/contracts-table";
import { NewContract } from "./_components/new-contract";

export default async function Home() {
	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-8 py-12">
			<NewContract />

			<Separator />

			<ContractsTable />
		</main>
	);
}
