// import { http, HttpResponse } from 'msw';

// // NOTE: pos.handlers.js also registers handlers for the same paths
// // (POST /api/orders/checkout, GET /api/orders, GET /api/orders/:id,
// // PATCH /api/orders/:id/status) and is registered first in server.js,
// // so it wins route resolution by default. orders.handlers.test.jsx
// // re-registers `ordersHandlers` via server.use(...) in its own
// // beforeEach to force MSW to prioritize these handlers for that file.
// // No logic changes needed here — the collision was purely about
// // registration order, not this file's implementation.

// // ─── SEED DATA ───
// const SEED = {
//   orders: [],
// };

// // ─── IN-MEMORY DATABASE ───
// let mockOrders = structuredClone(SEED.orders);
// let orderCounter = 1000;

// // ─── RESET FUNCTION (call in beforeEach for test isolation) ───
// export function resetOrdersMockData() {
//   mockOrders = structuredClone(SEED.orders);
//   orderCounter = 1000;
// }

// // Added alias for backward compatibility with tests
// export const resetMockData = resetOrdersMockData;

// // ─── HELPERS ───
// function generateId(prefix) {
//   return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
// }

// // ─── ORDERS HANDLERS ───
// export const ordersHandlers = [
//   // ═══════════════════════════════════════════════════════════
//   // 1. CHECKOUT — Used by the public ordering site's Checkout page
//   // ═══════════════════════════════════════════════════════════
//   http.post('*/api/orders/checkout', async ({ request }) => {
//     const payload = await request.json();

//     // Validate required customer details
//     if (!payload.customer_name || !payload.customer_phone) {
//       return HttpResponse.json(
//         { message: 'Missing required customer details.' },
//         { status: 400 }
//       );
//     }

//     // Validate cart has items
//     if (!payload.cartItems || payload.cartItems.length === 0) {
//       return HttpResponse.json(
//         { message: 'Cart is empty.' },
//         { status: 400 }
//       );
//     }

//     orderCounter += 1;
//     const newOrder = {
//       id: generateId('ord'),
//       order_no: `ORD-${orderCounter}`,
//       success: true,
//       ...payload,
//       status: 'Pending',
//       created_at: new Date().toISOString(),
//     };

//     mockOrders.push(newOrder);

//     return HttpResponse.json(newOrder, { status: 201 });
//   }),

//   // ═══════════════════════════════════════════════════════════
//   // 2. LIST — GET /api/orders (optional status filter)
//   // ═══════════════════════════════════════════════════════════
//   http.get('*/api/orders', ({ request }) => {
//     const url = new URL(request.url);
//     const status = url.searchParams.get('status') || '';

//     let filtered = [...mockOrders];

//     if (status && status !== 'All') {
//       filtered = filtered.filter(
//         (o) => (o.status || '').toLowerCase() === status.toLowerCase()
//       );
//     }

//     return HttpResponse.json({ success: true, data: filtered });
//   }),

//   // ═══════════════════════════════════════════════════════════
//   // 3. GET /api/orders/:id — Single order lookup
//   // ═══════════════════════════════════════════════════════════
//   http.get('*/api/orders/:id', ({ params }) => {
//     const order = mockOrders.find((o) => o.id === params.id);
//     if (!order) {
//       return HttpResponse.json(
//         { success: false, message: 'Order not found' },
//         { status: 404 }
//       );
//     }
//     return HttpResponse.json({ success: true, data: order });
//   }),

//   // ═══════════════════════════════════════════════════════════
//   // 4. PATCH /api/orders/:id/status — Update order status
//   // ═══════════════════════════════════════════════════════════
//   http.patch('*/api/orders/:id/status', async ({ params, request }) => {
//     const { id } = params;
//     const body = await request.json();
//     const index = mockOrders.findIndex((o) => o.id === id);

//     if (index === -1) {
//       return HttpResponse.json(
//         { success: false, message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     mockOrders[index] = {
//       ...mockOrders[index],
//       status: body.status || mockOrders[index].status,
//       updated_at: new Date().toISOString(),
//     };

//     return HttpResponse.json({
//       success: true,
//       message: 'Order status updated successfully',
//       data: mockOrders[index],
//     });
//   }),
// ];

import { http, HttpResponse } from 'msw';

const SEED = { orders: [] };
let mockOrders = structuredClone(SEED.orders);
let orderCounter = 1000;

export function resetOrdersMockData() {
  mockOrders = structuredClone(SEED.orders);
  orderCounter = 1000;
}

export const ordersHandlers = [
  // POST /api/orders/checkout
  http.post('/api/orders/checkout', async ({ request }) => {
    const payload = await request.json();

    if (!payload.customer_name || !payload.customer_phone) {
      return HttpResponse.json(
        { message: 'Missing required customer details.' },
        { status: 400 }
      );
    }

    if (!payload.cartItems || payload.cartItems.length === 0) {
      return HttpResponse.json(
        { message: 'Cart is empty.' },
        { status: 400 }
      );
    }

    orderCounter += 1;
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_no: `ORD-${orderCounter}`,
      success: true,
      ...payload,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    mockOrders.push(newOrder);

    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // GET /api/orders/:id
  http.get('/api/orders/:id', ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: order });
  }),

  // GET /api/orders (List & Status Filter)
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let result = mockOrders;
    if (status) {
      result = mockOrders.filter((o) => o.status === status);
    }

    return HttpResponse.json({ success: true, data: result });
  }),

  // PATCH /api/orders/:id/status
  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    const body = await request.json();
    const order = mockOrders.find((o) => o.id === params.id);

    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    order.status = body.status;

    return HttpResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  }),
];