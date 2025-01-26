import axios, { CreateAxiosDefaults } from 'axios';

const axiosConfig: CreateAxiosDefaults = {
    baseURL: 'https://opensky-network.org/api',
    auth: {
        username: process.env.OPENSKY_USERNAME as string,
        password: process.env.OPENSKY_PASSWORD as string,
    },
};

const client = axios.create(axiosConfig);

export default client;