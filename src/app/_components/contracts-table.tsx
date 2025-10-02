import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { sentenceCase } from "@/lib/utils";

const MOCK_CONTRACTS = [
	{
		id: "1005",
		contractDate: new Date("2025-10-01"),
		processedDate: new Date("2025-10-02"),
		status: "processing" as const,
	},
	{
		id: "1004",
		contractDate: new Date("2025-03-20"),
		processedDate: new Date("2025-03-25"),
		status: "safe" as const,
	},
	{
		id: "1003",
		contractDate: new Date("2025-03-05"),
		processedDate: new Date("2025-03-10"),
		status: "escalate" as const,
	},
	{
		id: "1002",
		contractDate: new Date("2025-02-10"),
		processedDate: new Date("2025-02-15"),
		status: "caution" as const,
	},
	{
		id: "1001",
		contractDate: new Date("2025-01-15"),
		processedDate: new Date("2025-01-20"),
		status: "safe" as const,
	},
];

const VARIANTS = {
	safe: "default",
	processing: "secondary",
	caution: "warning",
	escalate: "destructive",
} as const;

function StatusBadge({
	status,
}: { status: (typeof MOCK_CONTRACTS)[number]["status"] }) {
	return <Badge variant={VARIANTS[status]}>{sentenceCase(status)}</Badge>;
}

export function ContractsTable() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">ID</TableHead>
					<TableHead>Contract Date</TableHead>
					<TableHead>Upload Date</TableHead>
					<TableHead className="text-right">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{MOCK_CONTRACTS.map((contract) => (
					<TableRow key={contract.id}>
						<TableCell className="font-medium">{contract.id}</TableCell>
						<TableCell>{contract.contractDate.toLocaleDateString()}</TableCell>
						<TableCell>{contract.processedDate.toLocaleDateString()}</TableCell>
						<TableCell className="text-right">
							<StatusBadge status={contract.status} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
