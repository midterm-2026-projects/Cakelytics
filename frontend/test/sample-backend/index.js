// I-import mo yung arrays mula sa mga ginawa mong files
import { authHandlers } from './handlers/auth.handlers';
import { inventoryHandlers } from './handlers/inventory.handlers';
import { analyticsHandlers } from './handlers/analytics.handler'; 

// Pagsama-samahin lahat gamit ang spread operator (...)
export const handlers = [
  ...authHandlers,
  ...inventoryHandlers,
  ...analyticsHandlers,
];