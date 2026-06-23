import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../src/components/ProductCards';

it('should render the product details correctly', () => {
  // --- ARRANGE ---
  const mockProduct = {
    name: 'Chocolate Cake',
    price: 500,
    image: 'test-image.jpg',
    details: ['Moist chocolate sponge', 'Dark chocolate ganache'],
  };

  // --- ACT ---
  render(<ProductCard product={mockProduct} />);

  // --- ASSERT ---
  // Check if the name renders
  expect(screen.getByText(/chocolate cake/i)).toBeInTheDocument();

  // Check if the price renders (formatted with P and .00)
  expect(screen.getByText(/₱500.00/i)).toBeInTheDocument();

  // Check if the category badge exists
  expect(screen.getByText(/package/i)).toBeInTheDocument();

  // Check if the details list renders
  expect(screen.getByText(/moist chocolate sponge/i)).toBeInTheDocument();
  expect(screen.getByText(/dark chocolate ganache/i)).toBeInTheDocument();
});