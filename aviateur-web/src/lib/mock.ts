export interface Aircraft {
	id: string;
	type: string;
	registration: string;
	manufacturer: string;
	model: string;
	inService: boolean;
	capacity: {
		firstClass: number;
		business: number;
		economy: number;
	};
}

const americanAirlinesFleet: Aircraft[] = [
	{
		id: "AA-B738-N123AA",
		type: "B738",
		registration: "N123AA",
		manufacturer: "Boeing",
		model: "737-800",
		inService: true,
		capacity: {
			firstClass: 16,
			business: 30,
			economy: 126,
		},
	},
	{
		id: "AA-A321-N456AA",
		type: "A321",
		registration: "N456AA",
		manufacturer: "Airbus",
		model: "A321-200",
		inService: true,
		capacity: {
			firstClass: 20,
			business: 36,
			economy: 171,
		},
	},
	{
		id: "AA-B789-N789AA",
		type: "B789",
		registration: "N789AA",
		manufacturer: "Boeing",
		model: "787-9",
		inService: true,
		capacity: {
			firstClass: 30,
			business: 48,
			economy: 207,
		},
	},
	{
		id: "AA-A319-N234AA",
		type: "A319",
		registration: "N234AA",
		manufacturer: "Airbus",
		model: "A319-100",
		inService: true,
		capacity: {
			firstClass: 8,
			business: 24,
			economy: 96,
		},
	},
	{
		id: "AA-B772-N567AA",
		type: "B772",
		registration: "N567AA",
		manufacturer: "Boeing",
		model: "777-200ER",
		inService: true,
		capacity: {
			firstClass: 37,
			business: 52,
			economy: 204,
		},
	},
];

export async function getFleet() {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return americanAirlinesFleet;
}

const mockTimeline = [
	{
		fromName: "Dallas/Fort Worth International Airport",
		fromCode: "DFW",
		toName: "Los Angeles International Airport",
		toCode: "LAX",
		isCurrent: false,
		isStart: true,
		isEnd: false,
	},
	{
		fromName: "Los Angeles International Airport",
		fromCode: "LAX",
		toName: "John F. Kennedy International Airport",
		toCode: "JFK",
		isCurrent: false,
		isStart: false,
		isEnd: false,
	},
	{
		fromName: "John F. Kennedy International Airport",
		fromCode: "JFK",
		toName: "Miami International Airport",
		toCode: "MIA",
		isCurrent: true,
		isStart: false,
		isEnd: false,
	},
	{
		fromName: "Miami International Airport",
		fromCode: "MIA",
		toName: "Chicago O'Hare International Airport",
		toCode: "ORD",
		isCurrent: false,
		isStart: false,
		isEnd: false,
	},
	{
		fromName: "Chicago O'Hare International Airport",
		fromCode: "ORD",
		toName: "Dallas/Fort Worth International Airport",
		toCode: "DFW",
		isCurrent: false,
		isStart: false,
		isEnd: true,
	},
];

export function getTimeline() {
	return mockTimeline;
}
