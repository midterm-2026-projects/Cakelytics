import { beforeAll, afterEach, afterAll } from 'vitest';
import '@testing-library/jest-dom'; // Para gumana yung mga .toBeInTheDocument() ninyo
import { server } from './sample-backend/server'; // Siguraduhing tama ang path papunta sa server.js niyo

// Buhayin ang fake server bago mag-umpisa ang kahit anong test
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// I-reset ang mga fake routes pagkatapos ng bawat test para walang maiwang data
afterEach(() => server.resetHandlers());

// Patayin ang fake server kapag tapos na ang lahat ng tests
afterAll(() => server.close());