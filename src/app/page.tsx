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
			<Separator />
			<h2 className="pb-4 font-bold text-2xl">Test data</h2>
			<p>
				This Mutual Non-Disclosure Agreement is governed by the laws of England
				and Wales. Each party agrees to keep the other's confidential
				information secret for 2 years. Nothing in this Agreement shall restrict
				either Party from hiring employees of the other Party via general,
				non-targeted solicitations.
			</p>
			<p>
				Supplier Non-Disclosure Agreement Recipient agrees to indemnify and hold
				harmless the Discloser against any and all losses or damages arising out
				of a breach of this Agreement. This Agreement shall be governed by the
				laws of Germany.
			</p>
		</main>
	);
}
