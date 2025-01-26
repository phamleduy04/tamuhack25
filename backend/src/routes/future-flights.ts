import { Router } from 'express';
// import { getFlightCache } from '../db/cache';
// import openskyClient from '../apis/opensky';
import dayjs from 'dayjs';
import dayjsUTC from 'dayjs/plugin/utc';

dayjs.extend(dayjsUTC);

import { get, set } from '../db/cache';
import flightawareClient from '../apis/flightaware';

const route = Router();

interface Flight {
    ident_icao: string;
    origin: {
        code_icao: string;
        name: string;
    }
    destination: {
        code_icao: string;
        name: string;
    }
    estimated_out: string;
    estimated_in: string;
}

route.get('/', async (req, res) => {
    const { icao24 } = req.query;
    if (!icao24) {
        res.status(400).send('Invalid request!');
        return;
    }
    const cache = await get(`future-flights:${icao24}`);
    if (cache) {
        res.json(JSON.parse(cache));
        return;
    }
    const start = dayjs().utc().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
    const end = dayjs().utc().add(12, 'hours').format('YYYY-MM-DDTHH:mm:ss[Z]');

    const response = await flightawareClient.get(`/flights/${icao24}?start=${start}&end=${end}`);

    const data = response.data.flights as Flight[];

    const formattedData = data.map(flight => ({
        icao24: flight.ident_icao,
        estDepartureAirport: flight.origin.code_icao,
        estDepartureAirportFullName: flight.origin.name,
        estArrivalAirport: flight.destination.code_icao,
        estArrivalAirportFullName: flight.destination.name,
        estimated_out: flight.estimated_out,
        estimated_in: flight.estimated_in,
    }));

    res.json(formattedData);
    await set(`future-flights:${icao24}`, JSON.stringify(formattedData), 300);
});


export default route;
