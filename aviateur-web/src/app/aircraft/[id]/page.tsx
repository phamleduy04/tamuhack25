import { AircraftOverhead } from "@/components/map";
import Image from "next/image";
import Timeline from "./timelines";
import { $fetch, getAirportsData, getSpecificAircraftData } from "@/lib/api";

interface Props {
	params: {
		id: string;
	};
}

export default async function AircraftPage({ params }: Props) {
	const aircraft = await getSpecificAircraftData(params.id);

	if (!aircraft) {
		return <div>Aircraft not found</div>;
	}

	const { data: flightScheduleData, error } = await $fetch("/future-flights", {
		query: {
			icao24: params.id,
		},
	});

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const uniqueAirportIDs = new Set<string>();

	for (const flight of flightScheduleData) {
		if (flight.estDepartureAirport) {
			uniqueAirportIDs.add(flight.estDepartureAirport);
		}
		if (flight.estArrivalAirport) {
			uniqueAirportIDs.add(flight.estArrivalAirport);
		}
	}

	const airports = await getAirportsData(Array.from(uniqueAirportIDs));

	console.log("final airports data", airports);

	return (
		<div className="min-h-screen w-full pt-[25vh] max-w-7xl mx-auto px-10 font-arimo text-black">
			<div className="bg-white rounded-lg p-5 h-80 grid grid-cols-2 auto-rows-[100%]">
				<div className="flex flex-col items-start justify-center gap-y-2">
					<h1 className="text-8xl font-bold">{aircraft.tail_number}</h1>
					<p className="font-bold font-mono text-lg pl-1">
						Boeing {aircraft.latitude} • {aircraft.icao24.toUpperCase()}
					</p>
				</div>
				<div className="flex items-center justify-center overflow-hidden">
					<Image
						src={`/img/aircraft/a321.png`}
						alt={"Plane Image"}
						width={500}
						height={500}
						className="object-cover -translate-y-5 rotate-3 drop-shadow-2xl"
					/>
				</div>
			</div>
			<div className="grid grid-cols-5 auto-rows-[400px] gap-5 pt-5">
				<div className="bg-white col-span-2 rounded-lg p-5 flex flex-col justify-start">
					<h1 className="font-bold text-3xl">Flight Schedule</h1>

					<Timeline
						items={flightScheduleData.map((flight) => {
							return {
								fromName: flight.estDepartureAirport
									? airports[flight.estDepartureAirport].name
									: null,
								fromCode: flight.estDepartureAirport
									? airports[flight.estDepartureAirport].code
									: null,
								fromLocation: flight.estDepartureAirport
									? airports[flight.estDepartureAirport].location
									: null,
								toName: flight.estArrivalAirport
									? airports[flight.estArrivalAirport].name
									: null,
								toCode: flight.estArrivalAirport
									? airports[flight.estArrivalAirport].code
									: null,
								toLocation: flight.estArrivalAirport
									? airports[flight.estArrivalAirport].location
									: null,
								isCurrent:
									flight.estDepartureAirport === flight.estArrivalAirport,
								isStart:
									flight.estDepartureAirport === flight.estArrivalAirport,
								isEnd: flight.estDepartureAirport === flight.estArrivalAirport,
							};
						})}
					/>
				</div>
				<div className="bg-white col-span-3 rounded-lg overflow-hidden">
					<AircraftOverhead
						latitude={aircraft.latitude!}
						longitude={aircraft.longitude!}
					/>
				</div>
			</div>
		</div>
	);
}
