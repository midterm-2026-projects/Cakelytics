// I-import mo yung arrays mula sa mga ginawa mong files
import { authHandlers } from './handlers/auth.handlers';
// import { inventoryHandlers } from './handlers/inventory.handlers';
// import { posHandlers } from './handlers/pos.handlers'; // I-uncomment kapag ginawa na ng kaklase mo

// Pagsama-samahin lahat gamit ang spread operator (...)
export const handlers = [
  ...authHandlers,
  // ...inventoryHandlers,
  // ...posHandlers,
];