export const IS_TEST = false;

const BASE_URL_TEST = 'http://localhost:3001';
const BASE_URL_PROD = 'https://signcast-assignment-fullstack-production.up.railway.app';

export const BASE_URL = IS_TEST ? BASE_URL_TEST : BASE_URL_PROD;
