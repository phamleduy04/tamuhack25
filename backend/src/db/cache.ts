import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL as string);

const get = async (key: string) => {
    return await redis.get(key);
};

const set = async (key: string, value: string, time: number | null = null) => {
    if (!time) return await redis.set(key, value);
    return await redis.set(key, value);
};

const getFlightCache = async () => {
    return await get('cache');
};

const setFlightCache = async (data: string) => {
    return await redis.set('cache', data);
};



export { get, set, getFlightCache, setFlightCache };