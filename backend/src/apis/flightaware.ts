import axios from 'axios';

const client = axios.create({
    baseURL: 'https://aeroapi.flightaware.com/aeroapi',
    headers: {
        'x-apikey': process.env.FLIGHT_AWARE_KEY
    }
});

export default client;