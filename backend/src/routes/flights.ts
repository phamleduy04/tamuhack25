import { Router } from 'express';
import { getFlightCache } from '../db/cache';

const route = Router();

route.get('/', async (req, res) => {
    const data = await getFlightCache();
    if (data) {
        res.json(JSON.parse(data));
        return;
    }
    res.status(500).send('Internal Server Error');
});

export default route;