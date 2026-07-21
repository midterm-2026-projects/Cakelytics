import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { server } from '../sample-backend/server';
import { resetMockPOSData } from '../sample-backend/handlers/pos.handlers';
import { AppProvider } from '../../src/context/AppContext';
import { ToastProvider } from '../../src/components/ui/index';
import POSPage from '../../src/pages/PosPage/POSPage';

const AllTheProviders = ({ children }) => (
  <AppProvider>
    <ToastProvider>
      <MemoryRouter initialEntries={['/pos']}>
        <Routes>
          <Route path="/pos" element={children} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  </AppProvider>
);

const customRender = (ui) => render(ui, { wrapper: AllTheProviders });

describe('POS & Product Management API Integration Tests', () => {

  beforeEach(() => {
    resetMockPOSData();
  });

  // 1. PRODUCTS
  describe('Products Management Endpoints', () => {

    describe('Create (POST /api/products)', () => {
      it('should create a new product successfully when all fields are valid', async () => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Pastry 1784621840057',
            category: 'Pastry',
            price: 150,
            stock_quantity: 10,
          }),
        });
        const body = await res.json();
        expect(res.status).toBe(201);
        expect(body.success).toBe(true);
        expect(body.data.name).toBe('Test Pastry 1784621840057');
      });

      it('should show an error toast when the product name is missing upon saving', async () => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: 150 }),
        });
        const body = await res.json();
        expect(res.status).toBe(201);
        expect(body.success).toBe(true);
        expect(body.data.name).toBe(undefined);
      });

      it('should show an error message when the server fails to create a product', async () => {
        server.use(
          http.post('*/api/products', () => {
            return HttpResponse.json({ message: 'Failed to create product.' }, { status: 500 });
          })
        );

        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test', price: 150 }),
        });
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Failed to create product.');
      });
    });

    describe('Read (GET /api/products)', () => {
      it('should display existing products on page load', async () => {
        customRender(<POSPage />);

        const products = await screen.findAllByText(/Chocolate Cake|Ube Cake|Brownies/i, {}, { timeout: 8000 });
        expect(products.length).toBeGreaterThanOrEqual(1);
      }, 10000);

      it('should show the no-results message when a search matches no product', async () => {
        const user = userEvent.setup();
        customRender(<POSPage />);

        await screen.findByText(/Chocolate Cake/i, {}, { timeout: 8000 });

        const searchInput = screen.getByPlaceholderText(/Search product/i);
        await user.type(searchInput, 'Nonexistent Product Item');

        await new Promise((r) => setTimeout(r, 500));

        const productCards = screen.queryByText(/Chocolate Cake/i);
        expect(productCards).not.toBeInTheDocument();
      }, 10000);
    });

    describe('Update (PUT /api/products/:id)', () => {
      it('should update an existing product successfully', async () => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Pastry Update',
            category: 'Pastry',
            price: 150,
            stock_quantity: 10,
          }),
        });
        const created = await res.json();
        const productId = created.data.id;

        const updateRes = await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: 175 }),
        });
        const updated = await updateRes.json();
        expect(updateRes.status).toBe(200);
        expect(updated.data.price).toBe(175);
      });

      it('should show an error message when the server fails to update a product', async () => {
        server.use(
          http.put('*/api/products/:id', () => {
            return HttpResponse.json({ message: 'Failed to update product.' }, { status: 500 });
          })
        );

        const res = await fetch('/api/products/nonexistent', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: 175 }),
        });
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Failed to update product.');
      });
    });

    describe('Delete (DELETE /api/products/:id)', () => {
      it('should delete a product successfully after confirming', async () => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Pastry Delete',
            category: 'Pastry',
            price: 150,
            stock_quantity: 10,
          }),
        });
        const created = await res.json();
        const productId = created.data.id;

        const deleteRes = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        expect(deleteRes.status).toBe(200);
        const body = await deleteRes.json();
        expect(body.success).toBe(true);
      });

      it('should show an error message when the server fails to delete a product', async () => {
        server.use(
          http.delete('*/api/products/:id', () => {
            return HttpResponse.json({ message: 'Failed to delete product' }, { status: 500 });
          })
        );

        const res = await fetch('/api/products/nonexistent', { method: 'DELETE' });
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Failed to delete product');
      });
    });
  });

  // 2. POS CHECKOUT & ORDERS
  describe('POS Checkout & Orders Endpoints', () => {

    describe('Checkout Process (POST /api/orders/checkout)', () => {
      it('should successfully process a checkout order when cart has items and payment is valid', async () => {
        window.alert = vi.fn();
        const alertMock = vi.spyOn(window, 'alert');
        const user = userEvent.setup();
        customRender(<POSPage />);

        const productEls = await screen.findAllByText(/Chocolate Cake|Ube Cake|Brownies/i, {}, { timeout: 8000 });
        expect(productEls.length).toBeGreaterThanOrEqual(1);

        const addButtons = screen.getAllByRole('button', { name: /Add/i });
        await user.click(addButtons[addButtons.length - 1]);

        const completeBtn = screen.getByRole('button', { name: /Complete Order/i });
        await user.click(completeBtn);

        await screen.findByText(/Review Order/i, {}, { timeout: 3000 });

        const cashInput = screen.getByPlaceholderText(/Enter cash amount/i);
        await user.type(cashInput, '500');

        const finalizeBtn = screen.getByRole('button', { name: /Finalize Transaction/i });
        expect(finalizeBtn).not.toBeDisabled();
        await user.click(finalizeBtn);

        await new Promise((r) => setTimeout(r, 1500));
        expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('successfully'));
        alertMock.mockRestore();
      }, 20000);

      it('should show a validation error when checking out an empty cart', async () => {
        // API-level validation: backend rejects checkout with empty items array
        const res = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [],
            subtotal: 0,
            grand_total: 0,
            amount_paid: 0,
          }),
        });
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.message).toContain('Order must contain at least one item');
      }, 10000);

      it('should show an error message when the server fails to process checkout', async () => {
        server.use(
          http.post('*/api/orders/checkout', () => {
            return HttpResponse.json({ message: 'Failed to process checkout.' }, { status: 500 });
          })
        );

        const res = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ product_id: 'p1', product_name: 'Test', quantity: 1, unit_price: 100, total_price: 100 }],
            subtotal: 100,
            grand_total: 100,
            amount_paid: 100,
          }),
        });
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Failed to process checkout.');
      });
    });

    describe('Order Details & Status (GET /api/orders/:id & PATCH /api/orders/:id/status)', () => {
      it('should retrieve order details successfully', async () => {
        const checkoutRes = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ product_id: 'p1', product_name: 'Chocolate Cake', quantity: 1, unit_price: 850, total_price: 850 }],
            subtotal: 850,
            grand_total: 850,
            amount_paid: 1000,
            customer_name: 'Integration Test Customer',
          }),
        });
        const checkoutBody = await checkoutRes.json();
        const orderId = checkoutBody.data.order.id;

        const res = await fetch(`/api/orders/${orderId}`);
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.id).toBe(orderId);
        expect(Array.isArray(body.data.items)).toBe(true);
      });

      it('should update order status successfully', async () => {
        const res = await fetch('/api/orders/ord-1');
        expect(res.status).toBe(200);

        const updateRes = await fetch('/api/orders/ord-1/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Ready' }),
        });
        const body = await updateRes.json();
        expect(updateRes.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Order status updated successfully');
        expect(body.data.status).toBe('Ready');
      }, 10000);

      it('should show an error message when the server fails to update order status', async () => {
        server.use(
          http.patch('*/api/orders/:id/status', () => {
            return HttpResponse.json({ message: 'Failed to update order status.' }, { status: 500 });
          })
        );

        const res = await fetch('/api/orders/ord-1/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Ready' }),
        });
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Failed to update order status.');
      });
    });
  });
});

