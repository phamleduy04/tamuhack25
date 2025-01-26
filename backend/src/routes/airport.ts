import { Router } from 'express';
import { getAirport } from '../apis/airportdb';

const router = Router();

router.get('/', async (req, res) => {
    const { icao } = req.query;
    if (!icao) {
        res.status(400).send('Invalid request!');
        return;
    }
    const airportList = [...new Set(String(icao).split(','))];

    const response = await Promise.all(airportList.map(async (query) => {
        const airport = await getAirport(query as string);
        if (airport) return airport;
    }));

    res.json(response.filter(res => res));
});

export default router;