"use client";

import { useSearchParams } from "next/navigation";
import Viewer from "./reports/[id]/viewer";

export default function Page() {

	const searchParams = useSearchParams()
	return (
		<div className="h-screen w-full">
			<Viewer modelUrl={searchParams.get("url")!} />
		</div>
	);
}
