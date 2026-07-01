import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TopProductsList from '../../../src/components/Analytics/topProducts';

describe('TopProductsList', () => {
  it('should display only the top 5 products and render the empty state when no data is available', () => {
    const products = [
      { name: 'Coffee', sold: 120 },
      { name: 'Cake', sold: 95 },
      { name: 'Donut', sold: 80 },
      { name: 'Bread', sold: 70 },
      { name: 'Cookie', sold: 60 },
      { name: 'Muffin', sold: 50 },
      { name: 'Brownie', sold: 40 },
    ];

    const { rerender } = render(<TopProductsList products={products} />);

    // Only the first 5 products should be rendered
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Cake')).toBeInTheDocument();
    expect(screen.getByText('Donut')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    expect(screen.getByText('Cookie')).toBeInTheDocument();

    // These should not appear because only the top 5 are displayed
    expect(screen.queryByText('Muffin')).not.toBeInTheDocument();
    expect(screen.queryByText('Brownie')).not.toBeInTheDocument();

    // Empty state
    rerender(<TopProductsList products={[]} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByText(/No product data available/i)
    ).toBeInTheDocument();
  });
});