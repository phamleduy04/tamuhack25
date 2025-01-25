import seedrandom from 'seedrandom';
import haversine from 'haversine-distance';
import { DateTime } from 'luxon';
import { aircraft } from './data/aircraft';
import { Airport, Flight, FlightDuration, Location, RandomAircraft } from './types';

// Helper function to create a seeded random number generator
const createRandomGenerator = (seed: string): ((min: number, max: number) => number) => {
  const random = seedrandom(seed);
  return (min: number, max: number): number => {
    const r = random();
    return Math.floor(r * (max - min + 1) + min);
  };
};

// Convert meters to miles
const metersToMiles = (num: number): number => num / 1609.344;

// Calculate the distance between two locations (latitude/longitude) in miles
const calcDistance = (a: Location, b: Location): number => Math.round(metersToMiles(haversine(a, b)));

export class Generator {
  random: (min: number, max: number) => number;
  private usedIds: Set<string>; // Track used IDs to ensure uniqueness

  constructor(seed: string) {
    // Initialize the random number generator with the given seed
    this.random = createRandomGenerator(seed);
    this.usedIds = new Set(); // Initialize the set to track used IDs
  }

  // Determine the number of flights for a given route for a specific day
  numFlightsForRoute(): number {
    // Return a random number of flights between 5 and 15
    return this.random(5, 15);
  }

  // Generate a random flight for the given origin and destination
  flight(origin: Airport, destination: Airport, departureTime: DateTime): Flight {
    // Generate a random flight number (4 digits, padded with zeros)
    const flightNumber: string = this.random(1, 9999).toFixed(0).padStart(4, '0');

    // Calculate the distance between the origin and destination in miles
    const distance = calcDistance(origin.location, destination.location);

    // Assign a random aircraft from the available fleet
    const randAircraft = aircraft[this.random(0, aircraft.length - 1)];

    // Determine the flight duration based on distance and aircraft speed
    const duration: FlightDuration = {
      locale: '',
      hours: (distance / randAircraft.speed) * (this.random(1000, 1100) / 1000),
      minutes: 0,
    };
    duration.minutes = Math.floor(60 * (duration.hours - Math.floor(duration.hours)));
    duration.hours = Math.floor(duration.hours);
    duration.locale = `${duration.hours}h ${duration.minutes}m`;

    // Calculate the arrival time based on the departure time and flight duration
    const arrivalTime = departureTime.plus({ hours: duration.hours, minutes: duration.minutes }).setZone(destination.timezone);

    // Return the generated flight object
    return {
      flightNumber,
      origin,
      destination,
      distance,
      duration,
      departureTime: departureTime.toISO(),
      arrivalTime: arrivalTime.toISO(),
      aircraft: randAircraft,
    };
  }

  // Generate a random aircraft object with a unique ID
  generateAircraft(): RandomAircraft {
    const aircraftTypes = ['B738', 'A321', 'B789', 'A319', 'B772'];
    const manufacturers = ['Boeing', 'Airbus'];
    const models: { [key: string]: string[] } = {
      'B738': ['737-800'],
      'A321': ['A321-200'],
      'B789': ['787-9'],
      'A319': ['A319-100'],
      'B772': ['777-200ER'],
    };
    const capacities: { [key: string]: { firstClass: number; business: number; economy: number } } = {
      'B738': { firstClass: 16, business: 30, economy: 126 },
      'A321': { firstClass: 20, business: 36, economy: 171 },
      'B789': { firstClass: 30, business: 48, economy: 207 },
      'A319': { firstClass: 8, business: 24, economy: 96 },
      'B772': { firstClass: 37, business: 52, economy: 204 },
    };

    const speed : { [key: string]  : number } = {
      'B738': 450,
      'A321': 512,
      'B789': 610,
      'A319': 350,
      'B772': 402,
    }

    // Randomly select an aircraft type
    const type = aircraftTypes[this.random(0, aircraftTypes.length - 1)];
    let id: string;
    let registration: string;

    // Ensure the generated ID is unique
    do {
      registration = `N${this.random(10000, 99999).toString().padStart(5, '0')}`;
      id = `AA-${type}-${registration}`;
    } while (this.usedIds.has(id)); // Regenerate if the ID is already used

    // Add the new ID to the set of used IDs
    this.usedIds.add(id);

    return {
      id,
      type,
      registration,
      manufacturer: manufacturers[this.random(0, manufacturers.length - 1)],
      model: models[type][0], // Assuming each type has only one model for simplicity
      inService: true,
      capacity: capacities[type],
      speed: speed[type],
    };
  }

  // Generate a fleet of random aircraft with unique IDs
  generateFleet(size: number): RandomAircraft[] {
    const fleet: RandomAircraft[] = [];
    for (let i = 0; i < size; i++) {
      fleet.push(this.generateAircraft());
    }
    return fleet;
  }
}