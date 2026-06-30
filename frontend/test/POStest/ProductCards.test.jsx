import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../../src/components/POScomponents/ProductCards';

it('should render the product details correctly', () => {
  const mockProduct = {
    name: 'Chocolate Cake',
    category: 'Package',
    price: 500,
    image: 'test-image.jpg',
    stock: 'Available',
    details: ['Rich chocolate sponge', 'Velvety frosting'],
  };

  render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);

  expect(screen.getByText(/chocolate cake/i)).toBeInTheDocument();
  expect(screen.getByText(/stock: available/i)).toBeInTheDocument();
  expect(screen.getByText(/rich chocolate sponge/i)).toBeInTheDocument();
  expect(screen.getByText(/velvety frosting/i)).toBeInTheDocument();
  expect(screen.getByText(/₱500/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /\+ add/i })).toBeInTheDocument();
});