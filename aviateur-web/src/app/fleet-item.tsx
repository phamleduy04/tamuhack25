import { type AircraftType } from "@/lib/api";
import { getAircraftImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function FleetItem({ aircraft }: { aircraft: AircraftType }) {
	return (
		<Link href={`/aircraft/${aircraft.icao24}`}>
			<div className="bg-white text-black rounded aspect-video p-5">
				<div className="h-[80%] w-full flex items-center justify-center overflow-hidden">
					<Image
						src={getAircraftImage(42, aircraft.tail_number).image}
						alt={aircraft.icao24}
						width={250}
						height={250}
						className="object-cover -translate-y-2 -scale-100 rotate-[175deg] drop-shadow-3xl"
					/>
				</div>
				<div className="h-[20%] w-full flex items-end">
					<div className="flex flex-col justify-start items-start text-xs">
						<div className="flex justify-center items-baseline mr-auto font-bold text-sm gap-2">
							{aircraft.tail_number}
							<div className="text-sm font-bold text-zinc-900 text-opacity-30">
								(TAIL)
							</div>
						</div>
						<div className="text-xl font-mono font-bold flex justify-center items-baseline gap-2">
							{aircraft.icao24.toUpperCase()}
							<div className="text-sm font-bold text-zinc-900 text-opacity-30">
								(ICAO24)
							</div>
						</div>
					</div>
					<div className="justify-self-end ml-auto bg-black rounded-full text-white font-bold text-sm px-3 py-1">
						{getAircraftImage(42, aircraft.tail_number).aircraft}
					</div>
				</div>
			</div>
		</Link>
	);
}
