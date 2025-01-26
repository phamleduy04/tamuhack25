import Image from "next/image";
import { $fetch } from "@/lib/api";
import FleetItem from "./fleet-item";
import { Search } from "lucide-react";
import AircraftMap from "@/components/map";

export default async function Home() {
	const { data: fleet, error } = await $fetch("/flights");

	if (error) {
		console.error(error);
		return <div>Error</div>;
	}

	return (
		<div className="min-h-screen px-10 pt-[12vh] max-w-7xl mx-auto">
			<div className="aspect-video w-full rounded-lg bg-white mb-16 overflow-hidden">
				<AircraftMap />
			</div>
			<div className="grid grid-cols-2">
				<div>
					<h1 className="text-7xl font-bold">Fleet</h1>
				</div>
				<div className="flex items-center justify-end gap-x-2">
					<input className="bg-white px-8 text-md py-1 h-12 rounded-full w-72 text-black font-arimo font-semibold outline-none"></input>
					<button className="bg-white h-12 w-12 p-1 text-black rounded-full flex items-center justify-center">
						<Search strokeWidth={3} />
					</button>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-3 pt-8">
				{fleet.map((aircraft) => (
					<FleetItem key={aircraft.icao24} aircraft={aircraft} />
				))}
			</div>
		</div>
	);
}
