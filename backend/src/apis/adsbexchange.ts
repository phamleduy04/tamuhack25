import axios from 'axios';

const client = axios.create({
    baseURL: 'https://adsbexchange-com1.p.rapidapi.com/v2/',
    headers: {
        'x-rapidapi-host': 'adsbexchange-com1.p.rapidapi.com',
        'x-rapidapi-key': process.env.ADSBEXCHANGE_KEY
    }
});

export default client;