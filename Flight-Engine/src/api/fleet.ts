import { Router } from 'express';
import { fleets } from '../data/fleets';
import { RandomAircraft } from '../types' 

export const fleetsRouter = Router();

fleetsRouter.get('/', (req, res) => {
    const { id } = req.query;

    if (!id) {
        // If no query parameter is provided, return all fleets
        res.json(fleets);
    } else {
        // If a query parameter is provided, search for the specific plane
        const plane = fleets.find(plane => plane.id === id);

        if (plane) {
            // If the plane is found, return it
            res.json([plane]);
        } else {
            // If the plane is not found, return an error
            res.status(404).json({ error: 'Plane not found' });
        }
    }
});