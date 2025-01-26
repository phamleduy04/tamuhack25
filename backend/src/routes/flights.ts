import axios from 'axios';
import { Router } from 'express';
import { get, set } from '../db/cache';
import type { State } from '../types/opensky';

const client = axios.create({
    baseURL: 'https://opensky-network.org/api',
    auth: {
        username: process.env.OPENSKY_USERNAME as string,
        password: process.env.OPENSKY_PASSWORD as string,
    }
});

const route = Router();

route.get('/', async (req, res) => {
    const data = await get();
    if (data) {
        res.json(JSON.parse(data));
        return;
    }
    const response = await client.get('/states/all');
    const flightData = response.data.states.filter((state: State) => state[1] && state[1].startsWith('AAL')).map((state: State) => ({
        icao24: state[0],
        callsign: state[1],
        origin_country: state[2],
        time_position: state[3],
        last_contact: state[4],
        longitude: state[5],
        latitude: state[6],
        baro_altitude: state[7],
        on_ground: state[8],
        velocity: state[9],
        true_track: state[10],
        vertical_rate: state[11],
        sensors: state[12],
        geo_altitude: state[13],
        squawk: state[14],
        spi: state[15],
        position_source: state[16],
        category: state[17]
    }));

    await set(JSON.stringify(flightData));

    res.json(flightData);
});

export default route;