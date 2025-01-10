export const IS_TEST = true;

const BASE_URL_TEST = 'http://localhost:3003';
const BASE_URL_PROD = 'https://signcast-assignment-fullstack-production.up.railway.app';

const BASE_WEB_SOCKET_URL_TEST = 'ws://localhost:3003';
const BASE_WEB_SOCKET_URL_PROD = 'wss://signcast-assignment-fullstack-production.up.railway.app/';

export const BASE_URL = IS_TEST ? BASE_URL_TEST : BASE_URL_PROD;

export const BASE_WEB_SOCKET_URL = IS_TEST ? BASE_WEB_SOCKET_URL_TEST : BASE_WEB_SOCKET_URL_PROD;

