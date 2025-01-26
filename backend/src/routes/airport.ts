import { Router } from 'express';
import { get, set } from '../db/cache';
import { getAirport } from '../apis/airportdb';

const router = Router();

router.get('/', async (req, res) => {
    const { icao } = req.query;
    if (!icao) {
        res.status(400).send('Invalid request!');
        return;
    }
    const cache = await get(`future-flights:${icao}`);
    if (cache) {
        res.json(JSON.parse(cache));
        return;
    }
    const response = await getAirport(icao as string);
    res.json(response);
    await set(`future-flights:${icao}`, JSON.stringify(response));
});

export default router;