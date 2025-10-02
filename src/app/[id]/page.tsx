import { api } from "@/trpc/server";
import { ContractDetailPane } from "./_components/details";

export default async function DetailView({
	params,
}: { params: { id: string } }) {
	const { id } = await params;
	const contract = await api.contract.getById({ id });

	if (!contract) {
		throw new Error("Contract not found");
	}

	return <ContractDetailPane contract={contract} />;
}
