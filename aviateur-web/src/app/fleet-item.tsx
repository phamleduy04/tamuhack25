import { type AircraftType } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function FleetItem({ aircraft }: { aircraft: AircraftType }) {
	return (
		<Link href={`/aircraft/${aircraft.icao24}`}>
			<div className="bg-white text-black rounded aspect-video p-5">
				<div className="h-[80%] w-full flex items-center justify-center overflow-hidden">
					<Image
						src={`/img/aircraft/a321.png`}
						alt={aircraft.icao24}
						width={250}
						height={250}
					/>
				</div>
				<div className="h-[20%] w-full flex items-end">
					<h1 className="text-xl font-mono font-bold">{aircraft.icao24}</h1>
					<div className="justify-self-end ml-auto bg-black rounded-full text-white font-bold text-sm px-3 py-1">
						{aircraft.callsign}
					</div>
				</div>
			</div>
		</Link>
	);
}
