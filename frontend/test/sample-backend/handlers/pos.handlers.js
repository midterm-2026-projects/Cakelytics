
import { http, HttpResponse } from 'msw';

const SEED = {
  products: [
    {
      id: 'p1',
      name: 'Chocolate Cake',
      category: 'Pastry',
      price: 850,
      inclusion: '1 layer chocolate cake with frosting',
      image_url: '/products/chocolate-rolls.jpg',
      daily_limit: 10,
      is_active: true,
      allow_file_upload: false,
      stock_quantity: 5,
    },
    {
      id: 'p2',
      name: 'Ube Cake',
      category: 'Pastry',
      price: 950,
      inclusion: '1 layer ube cake with cream cheese frosting',
      image_url: '/products/ube-cake.jpg',
      daily_limit: 8,
      is_active: true,
      allow_file_upload: false,
      stock_quantity: 3,
    },
    {
      id: 'p3',
      name: 'Celebration Package A',
      category: 'Package',
      price: 2500,
      inclusion: 'Themed Cake (7x5) w/ Printed Toppers + 10 pcs Balloons',
      image_url: '/products/package-a.jpg',
      daily_limit: 3,
      is_active: true,
      allow_file_upload: true,
      stock_quantity: 2,
    },
    {
      id: 'p4',
      name: 'Printed Balloons',
      category: 'Celebration Material',
      price: 150,
      inclusion: 'Custom printed latex balloons (10 pcs)',
      image_url: '/products/printed-balloons.jpg',
      daily_limit: 20,
      is_active: true,
      allow_file_upload: false,
      stock_quantity: 50,
    },
    {
      id: 'p5',
      name: 'Brownies',
      category: 'Pastry',
      price: 350,
      inclusion: 'Box of 6 premium brownies',
      image_url: '/products/brownies.jpg',
      daily_limit: 15,
      is_active: true,
      allow_file_upload: false,
      stock_quantity: 10,
    },
  ],

  orders: [
    {
      id: 'ord-1',
      order_number: 'ORD-2024-001',
      customer_id: 'c1',
      customer_name: 'Juan Dela Cruz',
      phone_number: '09171234567',
      order_type: 'Pre-Order',
      source: 'walk-in',
      status: 'Confirmed',
      subtotal: 2500,
      additional_charge: 0,
      discount: 0,
      grand_total: 2500,
      payment_type: 'full',
      amount_paid: 2500,
      balance: 0,
      pickup_date: '2024-12-20',
      pickup_time: '14:00',
      special_instructions: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      order_number: 'ORD-2024-002',
      customer_id: 'c2',
      customer_name: 'Maria Santos',
      phone_number: '09179876543',
      order_type: 'Buy Now',
      source: 'walk-in',
      status: 'Ready',
      subtotal: 1200,
      additional_charge: 0,
      discount: 0,
      grand_total: 1200,
      payment_type: 'full',
      amount_paid: 1200,
      balance: 0,
      pickup_date: '2024-12-19',
      pickup_time: '11:00',
      special_instructions: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ord-3',
      order_number: 'ORD-2024-003',
      customer_id: 'c3',
      customer_name: 'Pedro Reyes',
      phone_number: '09175678901',
      order_type: 'Pre-Order',
      source: 'online',
      status: 'Completed',
      subtotal: 1800,
      additional_charge: 50,
      discount: 100,
      grand_total: 1750,
      payment_type: 'deposit',
      amount_paid: 875,
      balance: 875,
      pickup_date: '2024-12-18',
      pickup_time: '10:00',
      special_instructions: 'Please include a birthday note',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ord-4',
      order_number: 'ORD-2024-004',
      customer_id: null,
      customer_name: 'Walk-in',
      phone_number: null,
      order_type: 'Buy Now',
      source: 'walk-in',
      status: 'Cancelled',
      subtotal: 450,
      additional_charge: 0,
      discount: 0,
      grand_total: 450,
      payment_type: 'full',
      amount_paid: 0,
      balance: 450,
      pickup_date: null,
      pickup_time: null,
      special_instructions: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  orderItems: [
    { id: 'oi-1', order_id: 'ord-1', product_id: 'p3', product_name: 'Celebration Package A', quantity: 1, unit_price: 2500, total_price: 2500 },
    { id: 'oi-2', order_id: 'ord-2', product_id: 'p1', product_name: 'Chocolate Cake', quantity: 1, unit_price: 850, total_price: 850 },
    { id: 'oi-3', order_id: 'ord-2', product_id: 'p5', product_name: 'Brownies', quantity: 1, unit_price: 350, total_price: 350 },
    { id: 'oi-4', order_id: 'ord-3', product_id: 'p2', product_name: 'Ube Cake', quantity: 1, unit_price: 950, total_price: 950 },
    { id: 'oi-5', order_id: 'ord-3', product_id: 'p4', product_name: 'Printed Balloons', quantity: 2, unit_price: 150, total_price: 300 },
    { id: 'oi-6', order_id: 'ord-1', product_id: 'p5', product_name: 'Brownies', quantity: 1, unit_price: 350, total_price: 350 },
  ],
};

// ─── IN-MEMORY DATABASE ───
let mockProducts = structuredClone(SEED.products);
let mockOrders = structuredClone(SEED.orders);
let mockOrderItems = structuredClone(SEED.orderItems);

// ─── RESET FUNCTION (call in beforeEach for test isolation) ───
export function resetMockPOSData() {
  mockProducts = structuredClone(SEED.products);
  mockOrders = structuredClone(SEED.orders);
  mockOrderItems = structuredClone(SEED.orderItems);
}

// Added alias for backward compatibility with tests
export const resetMockData = resetMockPOSData;

// ─── HELPERS ───
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function findOrderItems(orderId) {
  return mockOrderItems.filter((item) => item.order_id === orderId);
}

// ─── POS HANDLERS ───
export const posHandlers = [
  // ═══════════════════════════════════════════════════════════
  // 1. PRODUCTS — Shared by POS Page & Product Management Page
  // ═══════════════════════════════════════════════════════════
  http.get('*/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || '';
    const search = url.searchParams.get('search') || '';

    let filtered = [...mockProducts];

    // Filter by category (case-insensitive)
    if (category && category !== 'All') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term (case-insensitive)
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
    }

    return HttpResponse.json({ success: true, data: filtered });
  }),

  http.post('*/api/products', async ({ request }) => {
    const body = await request.json();
    const newProduct = {
      id: generateId('p'),
      name: body.name,
      category: body.category || 'Pastry',
      price: Number(body.price) || 0,
      inclusion: body.inclusion ?? body.description ?? '',
      image_url: body.image_url || null,
      daily_limit: body.daily_limit ?? 0,
      is_active: body.is_active !== false,
      allow_file_upload: body.allow_file_upload ?? false,
      stock_quantity: body.stock_quantity || 0,
    };
    mockProducts.push(newProduct);
    return HttpResponse.json({ success: true, data: newProduct }, { status: 201 });
  }),

  http.put('*/api/products/:id', async ({ request, params }) => {
    const { id } = params;
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    mockProducts[index] = {
      ...mockProducts[index],
      name: body.name ?? mockProducts[index].name,
      category: body.category ?? mockProducts[index].category,
      price: body.price !== undefined ? Number(body.price) : mockProducts[index].price,
      inclusion: body.inclusion ?? body.description ?? mockProducts[index].inclusion,
      image_url: body.image_url !== undefined ? body.image_url : mockProducts[index].image_url,
      daily_limit: body.daily_limit !== undefined ? body.daily_limit : mockProducts[index].daily_limit,
      is_active: body.is_active !== undefined ? body.is_active : mockProducts[index].is_active,
      allow_file_upload: body.allow_file_upload !== undefined ? body.allow_file_upload : mockProducts[index].allow_file_upload,
      stock_quantity: body.stock_quantity !== undefined ? body.stock_quantity : mockProducts[index].stock_quantity,
    };

    return HttpResponse.json({ success: true, data: mockProducts[index] });
  }),

  http.delete('*/api/products/:id', ({ params }) => {
    const { id } = params;
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    mockProducts.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // ═══════════════════════════════════════════════════════════
  // 2. ORDERS — Used by All Orders Page
  // ═══════════════════════════════════════════════════════════
  http.get('*/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';

    let filtered = [...mockOrders];

    // Filter by status (case-insensitive)
    if (status && status !== 'All') {
      filtered = filtered.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Attach order items to each order for enriched response
    const enriched = filtered.map((order) => ({
      ...order,
      items: findOrderItems(order.id),
    }));

    return HttpResponse.json({ success: true, data: enriched });
  }),

  // ═══════════════════════════════════════════════════════════
  // 2b. GET /api/orders/:id — Single order with items
  // ═══════════════════════════════════════════════════════════
  http.get('*/api/orders/:id', ({ params }) => {
    const { id } = params;
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { ...order, items: findOrderItems(order.id) },
    });
  }),

  // ═══════════════════════════════════════════════════════════
  // 2c. PATCH /api/orders/:id/status — Update order status
  // ═══════════════════════════════════════════════════════════
  http.patch('*/api/orders/:id/status', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const index = mockOrders.findIndex((o) => o.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    mockOrders[index] = {
      ...mockOrders[index],
      status: body.status || mockOrders[index].status,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: { ...mockOrders[index], items: findOrderItems(mockOrders[index].id) },
    });
  }),

  // ═══════════════════════════════════════════════════════════
  // 3. CHECKOUT — Used by POS Page when completing an order
  // ═══════════════════════════════════════════════════════════
  http.post('*/api/orders/checkout', async ({ request }) => {
    const body = await request.json();

    // Validate that items exist
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return HttpResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Create the order
    const newOrder = {
      id: generateId('ord'),
      order_number: body.order_number || `ORD-${Date.now()}`,
      customer_id: body.customer_id || null,
      customer_name: body.customer_name || 'Walk-in',
      phone_number: body.phone_number || null,
      order_type: body.order_type || 'Buy Now',
      source: body.source || 'walk-in',
      status: body.status || 'Confirmed',
      subtotal: Number(body.subtotal) || 0,
      additional_charge: Number(body.additional_charge) || 0,
      discount: Number(body.discount) || 0,
      grand_total: Number(body.grand_total) || 0,
      payment_type: body.payment_type || 'cash',
      amount_paid: Number(body.amount_paid) || 0,
      balance: Number(body.balance) || 0,
      pickup_date: body.pickup_date || null,
      pickup_time: body.pickup_time || null,
      special_instructions: body.special_instructions || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockOrders.push(newOrder);

    // Create order items
    const newItems = body.items.map((item, idx) => ({
      id: generateId('oi'),
      order_id: newOrder.id,
      product_id: item.product_id || null,
      product_name: item.product_name || item.name || 'Unknown Product',
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price ?? item.price ?? 0),
      total_price: Number(item.total_price ?? item.lineTotal ?? item.quantity * (item.unit_price ?? item.price ?? 0)),
    }));

    mockOrderItems.push(...newItems);

    return HttpResponse.json(
      {
        success: true,
        data: {
          order: newOrder,
          items: newItems,
        },
      },
      { status: 201 }
    );
  }),
];

