"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("query") || "");

	const handleSearch = () => {
		const params = new URLSearchParams(searchParams);
		if (query) {
			params.set("query", query);
		} else {
			params.delete("query");
		}
		router.push(`/?${params.toString()}`);
	};

	return (
		<div className="flex items-center justify-end gap-x-2">
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSearch()}
				className="bg-white px-8 text-md py-1 h-12 rounded-full w-72 text-black font-arimo font-semibold outline-none"
				placeholder="Search fleet..."
			/>
			<button
				onClick={handleSearch}
				className="bg-white h-12 w-12 p-1 text-black rounded-full flex items-center justify-center"
			>
				<Search strokeWidth={3} />
			</button>
		</div>
	);
}
