import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default async function Home() {
	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-8 py-12">
			<h2 className="font-bold text-2xl">Process Contract</h2>
			<Card>
				<CardContent>
					<Textarea placeholder="Paste contract here..." />
				</CardContent>
				<CardFooter>
					<Button>Scan</Button>
				</CardFooter>
			</Card>
			<Separator />
			<h2 className="font-bold text-2xl">Previous Contracts</h2>
		</main>
	);
}
