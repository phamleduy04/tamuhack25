import axios from 'axios';
import { get, set } from '../db/cache';


const getAirport = async (icao: string) => {
    try {
        const cache = await get(`airports:${icao}`);
        if (cache) return JSON.parse(cache);
        const response = await axios.get(`https://airportdb.io/api/v1/airport/${icao}?apiToken=${process.env.AIRPORT_DB_TOKEN}`);
        const data = response.data;
        const returnData = {
            icao: data.icao_code,
            name: data.name,
            code: data.local_code,
            location: data.municipality,
        };
        await set(`airports:${icao}`, JSON.stringify(returnData));
        return returnData;
    } catch {
        return null;
    }
};

export { getAirport };