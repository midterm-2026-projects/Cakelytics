import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import OrderTypeBadge from '../../../src/components/AllOrdersComponents/Ordertypebadge';

it('should render correct style for Buy Now type', () => {
  render(<OrderTypeBadge type="Buy Now" />);
  const badge = screen.getByText('Buy Now');
  expect(badge.className).toContain('bg-green-50');
});