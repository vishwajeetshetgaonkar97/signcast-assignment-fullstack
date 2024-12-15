export const IS_TEST = true;

const BASE_URL_TEST = 'http://localhost:3000';
const BASE_URL_PROD = 'https://interapis.sportvot.com';

export const BASE_URL = IS_TEST ? BASE_URL_TEST : BASE_URL_PROD;

const SOCKET_BASE_URL_TEST = 'https://socket.test.sportvot.com/';
const SOCKET_BASE_URL_PROD = 'https://socket.sportvot.com/';

export const SOCKET_BASE_URL = IS_TEST
  ? SOCKET_BASE_URL_TEST
  : SOCKET_BASE_URL_PROD;
