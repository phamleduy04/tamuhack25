"use client";

import { Map, Marker, ColorScheme, Annotation } from "mapkit-react";
import Image from "next/image";

interface AircraftMapProps {
	coords: {
		latitude: number;
		longitude: number;
	}[];
}

export default function AircraftMap({ coords }: AircraftMapProps) {
	return (
		<Map
			token={process.env.NEXT_PUBLIC_MAPKIT_TOKEN!}
			colorScheme={ColorScheme.Dark}
			initialRegion={{
				centerLatitude: 39.8283,
				centerLongitude: -98.5795,
				latitudeDelta: 50,
				longitudeDelta: 50,
			}}
		>
			{coords.map((coord, index) => (
				<Annotation
					latitude={coord.latitude}
					longitude={coord.longitude}
					key={`bmitem_${index}`}
				>
					<Image
						alt="Flight Icon"
						src={"/img/flight-icon.png"}
						height={20}
						width={20}
						style={{ transform: `rotate(${Math.random() * 360}deg)` }}
					/>
				</Annotation>
			))}
		</Map>
	);
}

interface AircraftOverheadProps {
	latitude: number;
	longitude: number;
}

export function AircraftOverhead({
	latitude,
	longitude,
}: AircraftOverheadProps) {
	return (
		<Map
			token={process.env.NEXT_PUBLIC_MAPKIT_TOKEN!}
			colorScheme={ColorScheme.Dark}
			initialRegion={{
				centerLatitude: latitude,
				centerLongitude: longitude,
				latitudeDelta: 10,
				longitudeDelta: 10,
			}}
		>
			{/* <Marker
				glyphImage={{
					1: "/img/flight-icon.png",
				}}
				latitude={latitude}
				longitude={longitude}
			/> */}
			<Annotation latitude={latitude} longitude={longitude}>
				<Image
					alt="Flight Icon"
					src={"/img/flight-icon.png"}
					height={40}
					width={40}
				/>
			</Annotation>
		</Map>
	);
}
