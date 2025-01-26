import Image from "next/image";
import { $fetch } from "@/lib/api";
import FleetItem from "./fleet-item";
import AircraftMap from "@/components/map";
import SearchBar from "./search-bar";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	const { data: fleet, error } = await $fetch("/flights");

	if (error) {
		console.error(error);
		return <div>Error</div>;
	}

	console.log("val", (await searchParams).query);

	const query = (await searchParams).query?.toLowerCase();
	const filteredFleet = query
		? fleet.filter(
				(aircraft) =>
					aircraft.tail_number?.toLowerCase().includes(query) ||
					aircraft.icao24.toLowerCase().includes(query)
		  )
		: fleet;

	const coords = filteredFleet
		.filter(
			(aircraft) => aircraft.latitude !== null && aircraft.longitude !== null
		)
		.map((aircraft) => ({
			latitude: aircraft.latitude!,
			longitude: aircraft.longitude!,
		}));

	return (
		<div className="min-h-screen px-10 pt-[12vh] max-w-7xl mx-auto">
			<div className="aspect-video w-full rounded-lg bg-white mb-16 overflow-hidden">
				<AircraftMap coords={coords} />
			</div>
			<div className="grid grid-cols-2">
				<div>
					<h1 className="text-7xl font-bold">Fleet</h1>
				</div>
				<SearchBar />
			</div>
			<div className="grid grid-cols-3 gap-3 pt-8">
				{filteredFleet.map((aircraft) => (
					<FleetItem key={aircraft.icao24} aircraft={aircraft} />
				))}
			</div>
		</div>
	);
}
