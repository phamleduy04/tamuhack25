import { Router } from 'express';
// import { getFlightCache } from '../db/cache';
import openskyClient from '../apis/opensky';
import dayjs from 'dayjs';
import { get, set } from '../db/cache';

const route = Router();

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
    const now = dayjs();
    const response = await openskyClient.get(`/flights/aircraft?icao24=${icao24}&begin=${now.subtract(1, 'day').unix()}&end=${now.add(1, 'day').unix()}`);
    res.json(response.data);
    await set(`future-flights:${icao24}`, JSON.stringify(response.data), 300);
});


export default route;
