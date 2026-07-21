import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../sample-backend/server';
import {
  ordersHandlers,
  resetOrdersMockData,
} from '../sample-backend/handlers/orders.handlers';

// ─── SAMPLE TEST DATA ───
const SAMPLE_CART_ITEMS = [
  {
    product_id: 'p1',
    product_name: 'Chocolate Cake',
    quantity: 1,
    price: 850,
    unit_price: 850,
    total_price: 850,
  },
];

const VALID_CHECKOUT_PAYLOAD = {
  customer_name: 'Myra Daluz',
  customer_phone: '09066257872',
  grand_total: 850,
  payment_type: 'deposit',
  cartItems: SAMPLE_CART_ITEMS,
};

describe('orders.handlers (direct API tests)', () => {
  beforeEach(() => {
    resetOrdersMockData();
    server.use(...ordersHandlers);
  });

  afterEach(() => {
    server.resetHandlers();
  });

  // ==========================================
  // 1. POST /api/orders/checkout
  // ==========================================
  describe('POST /api/orders/checkout', () => {
    it('should create an order successfully when payload is valid', async () => {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });

      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.status).toBe('Pending');
      expect(body.order_no).toMatch(/^ORD-\d+$/);
      expect(body.id).toBeDefined();
      expect(body.customer_name).toBe('Myra Daluz');
      expect(body.customer_phone).toBe('09066257872');
      expect(body.created_at).toBeDefined();
    });

    it('should return 400 when customer_name is missing', async () => {
      const { customer_name, ...payloadWithoutName } = VALID_CHECKOUT_PAYLOAD;

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithoutName),
      });

      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe('Missing required customer details.');
    });

    it('should return 400 when customer_phone is missing', async () => {
      const { customer_phone, ...payloadWithoutPhone } = VALID_CHECKOUT_PAYLOAD;

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithoutPhone),
      });

      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe('Missing required customer details.');
    });

    it('should return 400 when cartItems is empty', async () => {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...VALID_CHECKOUT_PAYLOAD, cartItems: [] }),
      });

      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe('Cart is empty.');
    });

    it('should return 400 when cartItems is missing entirely', async () => {
      const { cartItems, ...payloadWithoutCart } = VALID_CHECKOUT_PAYLOAD;

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithoutCart),
      });

      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe('Cart is empty.');
    });

    it('should increment order_no on each successful checkout', async () => {
      const firstRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });
      const firstBody = await firstRes.json();

      const secondRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });
      const secondBody = await secondRes.json();

      expect(firstBody.order_no).not.toBe(secondBody.order_no);
    });

    it('should propagate a simulated server error', async () => {
      server.use(
        http.post('*/api/orders/checkout', () => {
          return HttpResponse.json(
            { message: 'Failed to process checkout.' },
            { status: 500 }
          );
        })
      );

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.message).toBe('Failed to process checkout.');
    });
  });

  // ==========================================
  // 2. GET /api/orders/:id
  // ==========================================
  describe('GET /api/orders/:id', () => {
    it('should retrieve a previously created order by id', async () => {
      const checkoutRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });
      const created = await checkoutRes.json();

      const res = await fetch(`/api/orders/${created.id}`);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(created.id);
      expect(body.data.customer_name).toBe('Myra Daluz');
    });

    it('should return 404 for a non-existent order id', async () => {
      const res = await fetch('/api/orders/does-not-exist');
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Order not found');
    });
  });

  // ==========================================
  // 3. GET /api/orders (list + status filter)
  // ==========================================
  describe('GET /api/orders', () => {
    it('should list all created orders', async () => {
      await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });
      await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
      });

      const res = await fetch('/api/orders');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
    });

    it('should filter orders by status', async () => {
      const created = await (
        await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
        })
      ).json();

      await fetch(`/api/orders/${created.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ready' }),
      });

      const res = await fetch('/api/orders?status=Ready');
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].status).toBe('Ready');
    });
  });

  // ==========================================
  // 4. PATCH /api/orders/:id/status
  // ==========================================
  describe('PATCH /api/orders/:id/status', () => {
    it('should update the status of an existing order', async () => {
      const created = await (
        await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(VALID_CHECKOUT_PAYLOAD),
        })
      ).json();

      const res = await fetch(`/api/orders/${created.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Order status updated successfully');
      expect(body.data.status).toBe('Completed');
    });

    it('should return 404 when updating status of a non-existent order', async () => {
      const res = await fetch('/api/orders/does-not-exist/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Order not found');
    });
  });
});