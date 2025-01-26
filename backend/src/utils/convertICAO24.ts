import { get, set } from '../db/cache';
import adsbexchangeClient from '../apis/adsbexchange';

const getTailNumber = async (icao: string) => {
    const cache = await get(`icao:${icao}`);
    if (cache) return cache;
    const response = await adsbexchangeClient.get(`/hex/${icao}/`);

    const data = response.data;
    await set(`icao:${icao}`, data.r);
    return data.r;
};

export { getTailNumber };