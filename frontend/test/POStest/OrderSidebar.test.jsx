import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSidebar from '../../src/components/POScomponents/OrderSidebar';

describe('OrderSidebar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows empty cart message when cart is empty', () => {
    render(
      <OrderSidebar
        cart={[]}
        subtotal={0}
        additional={0}
        setAdditional={() => {}}
        discount={0}
        setDiscount={() => {}}
        total={0}
        updateQuantity={() => {}}
        removeItem={() => {}}
      />
    );

    expect(screen.getByText(/wala pang items/i)).toBeInTheDocument();
    expect(screen.getByText(/pumili ng produkto sa kaliwa/i)).toBeInTheDocument();
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();

    const subtotalRow = screen.getByText('Subtotal').closest('div');
    expect(subtotalRow).toBeTruthy();
    expect(subtotalRow).toHaveTextContent('₱0.00');

    expect(screen.getByText(/grand total/i)).toBeInTheDocument();
  });

  it('renders cart item details and calls interaction handlers', () => {
    const updateQuantity = vi.fn();
    const removeItem = vi.fn();
    const setAdditional = vi.fn();
    const setDiscount = vi.fn();

    render(
      <OrderSidebar
        cart={[{ id: 'p1', name: 'Test Product', price: 120, quantity: 2 }]}
        subtotal={240}
        additional={50}
        setAdditional={setAdditional}
        discount={20}
        setDiscount={setDiscount}
        total={270}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();

    const itemRow = screen.getByText('Test Product').closest('div');
    expect(itemRow).toBeTruthy();
    expect(itemRow).toHaveTextContent('₱240.00');

    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByText('₱270.00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '-' }));
    expect(updateQuantity).toHaveBeenCalledWith('p1', -1);

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(updateQuantity).toHaveBeenCalledWith('p1', 1);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(removeItem).toHaveBeenCalledWith('p1');

    fireEvent.change(screen.getByDisplayValue('50'), { target: { value: '60' } });
    expect(setAdditional).toHaveBeenCalledWith(60);

    fireEvent.change(screen.getByDisplayValue('20'), { target: { value: '15' } });
    expect(setDiscount).toHaveBeenCalledWith(15);
  });
});
