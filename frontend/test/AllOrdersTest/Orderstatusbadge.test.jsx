import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import OrderStatusBadge from '../../src/components/AllOrdersComponents/Orderstatusbadge';

it('should render correct style for Confirmed status', () => {
  render(<OrderStatusBadge status="Confirmed" />);
  const badge = screen.getByText('Confirmed');
  expect(badge.className).toContain('bg-blue-50');
});