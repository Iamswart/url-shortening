import { Redis } from 'ioredis';
import logger from './logger';

let client: Redis;

export const init = async (redisClient: Redis): Promise<any> => {
  redisClient.on('connect', (): any => {
    logger.info('REDIS CLIENT Connected');
  });

  redisClient.on('error', (err: any): any => {
    logger.info(`[REDIS CONNECTION ERROR] ==> ${err}`);
  });

  client = redisClient;
};

export const get = async (key: string): Promise<any> => {
  try {
    const response = await client.get(key);
    return response;
  } catch (error) {
    return null;
  }
};

export const set = async (
  key: string,
  value: any,
  expiryInSeconds: number,
): Promise<any> => {
  const setValue = await client.set(key, value);
  if (expiryInSeconds) {
    client.expire(key, expiryInSeconds);
  }

  return setValue;
};

export const acquireLock = async (key: string) => {
  const value = await client.setnx(key, 'locked');
  if (value) {
    const expiryInSeconds = 60 * 10; 
    client.expire(key, expiryInSeconds);
  }

  return value;
};

export const del = async (key: string): Promise<any> => {
  try {
    const response = await client.del(key);
    return response;
  } catch (error) {
    return null;
  }
};

export const hset = async (
  key: string,
  data: [string, string | number][],
  expiryInSeconds?: number,
): Promise<number> => {
  const setValue = await client.hset(key, data);
  if (expiryInSeconds) {
    client.expire(key, expiryInSeconds);
  }

  return setValue;
};

export const hget = async (key: string, field: string): Promise<any> => {
  return client.hget(key, field);
};

export const hGetAll = (key: string): Promise<{ [key: string]: string | number }> =>
  client.hgetall(key);

export const hdel = async (key: string, field: string): Promise<any> => {
  return client.hdel(key, field);
};

export const increment = async (key: string): Promise<any> => {
  return client.incr(key);
};
