import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Orderstable from '../../src/components/AllOrdersComponents/Orderstable';

const mockOrders = [{ id: '0241', customer: 'Maria Santos', type: 'Pre-Order', amount: 1500, status: 'Confirmed' }];

it('should render order id and call onViewDetails', () => {
  const onViewDetails = vi.fn();
  render(<Orderstable orders={mockOrders} onViewDetails={onViewDetails} />);
  expect(screen.getByText('#0241')).toBeDefined();
  const btn = screen.getByText('View Details');
  fireEvent.click(btn);
  expect(onViewDetails).toHaveBeenCalled();
});