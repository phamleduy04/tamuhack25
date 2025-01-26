import axios from 'axios';

const getAirport = async (icao: string) => {
    try {
        const response = await axios.get(`https://airportdb.io/api/v1/airport/${icao}?apiToken=${process.env.AIRPORT_DB_TOKEN}`);
        return response.data;
    } catch {
        return null;
    }
};

export { getAirport };