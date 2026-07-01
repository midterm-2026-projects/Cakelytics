import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import OrdersSearchBar from '../../src/components/AllOrdersComponents/Ordersearchbar';

it('should update value on change', () => {
  const setSearchTerm = vi.fn();
  render(<OrdersSearchBar searchTerm="" setSearchTerm={setSearchTerm} />);
  const input = screen.getByPlaceholderText(/Search order ID/i);
  fireEvent.change(input, { target: { value: 'ORD-0241' } });
  expect(setSearchTerm).toHaveBeenCalledWith('ORD-0241');
});