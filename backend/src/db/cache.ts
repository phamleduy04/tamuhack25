import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL as string);

const get = async () => {
    return await redis.get('cache');
};

const set = async (data: string) => {
    return await redis.set('cache', data, 'EX', 60);
};

export { get, set };