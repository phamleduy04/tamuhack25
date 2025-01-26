import { createFetch, createSchema } from "@better-fetch/fetch";
import { logger } from "@better-fetch/logger";
import { TypeOf, z } from "zod";

const aircraftSchema = z.object({
	icao24: z.string(),
	callsign: z.string().nullable(),
	origin_country: z.string(),
	time_position: z.number().nullable(),
	last_contact: z.number(),
	longitude: z.number().nullable(),
	latitude: z.number().nullable(),
	baro_altitude: z.number().nullable(),
	on_ground: z.boolean(),
	velocity: z.number().nullable(),
	true_track: z.number().nullable(),
	vertical_rate: z.number().nullable(),
	sensors: z.array(z.number()).nullable(),
	geo_altitude: z.number().nullable(),
	squawk: z.string().nullable(),
	spi: z.boolean(),
	position_source: z.number(),
	tail_number: z.string(),
});

const airportSchema = z.object({
	icao: z.string(),
	name: z.string(),
	code: z.string(),
	location: z.string(),
});

export type AircraftType = z.infer<typeof aircraftSchema>;
export type AirportType = z.infer<typeof airportSchema>;

const schema = createSchema({
	"/flights": {
		method: "get",
		query: z
			.object({
				id: z.string(),
			})
			.optional(),
		input: z.any().optional(),
		output: z.array(aircraftSchema),
	},
	"/future-flights": {
		method: "get",
		query: z.object({
			icao24: z.string(),
		}),
		output: z.array(
			z.object({
				icao24: z.string(),
				firstSeen: z.number(),
				estDepartureAirport: z.string().nullable(),
				lastSeen: z.number(),
				estArrivalAirport: z.string().nullable(),
				callsign: z.string(),
				estDepartureAirportHorizDistance: z.number().nullable(),
				estDepartureAirportVertDistance: z.number().nullable(),
				estArrivalAirportHorizDistance: z.number().nullable(),
				estArrivalAirportVertDistance: z.number().nullable(),
				departureAirportCandidatesCount: z.number(),
				arrivalAirportCandidatesCount: z.number(),
			})
		),
	},
	"/airport": {
		method: "get",
		query: z.object({
			icao: z.string(),
		}),
		output: z.array(airportSchema),
	},
});

export const $fetch = createFetch({
	baseURL: "https://api.aviateur.tech",
	schema: schema,
	plugins: [logger()],
});

export async function getAirportsData(icaoCodes: string[]) {
	const { data, error } = await $fetch("/airport", {
		query: { icao: icaoCodes.join(",") },
	});

	if (error) {
		console.log("error fetching airports data", error);
		return {};
	}

	const airports: Record<string, (typeof data)[number]> = {};

	data.forEach((airport) => {
		airports[airport.icao] = airport;
	});

	return airports;
}

export async function getSpecificAircraftData(icao24: string) {
	const { data: fleet, error } = await $fetch("/flights");

	if (error) {
		console.log("error fetching fleet data", error);
		return null;
	}

	const aircraft = fleet.find((aircraft) => aircraft.icao24 === icao24);

	if (!aircraft) {
		console.log("aircraft not found");
		return null;
	}

	return aircraft;
}
