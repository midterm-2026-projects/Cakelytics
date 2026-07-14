import { setupServer } from 'msw/node';
import { handlers } from './index'; // Kukunin niya yung pinagsamang handlers

export const server = setupServer(...handlers);