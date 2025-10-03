import { api } from "@/trpc/server";
import { ContractDetailPane } from "./_components/details";
import { DetailQueries } from "./_components/queries";

export default async function DetailView({
	params,
}: { params: { id: string } }) {
	const { id } = await params;

	return <DetailQueries id={id} />;
}
