import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TopProductsList from '../../../src/components/Analytics/topProducts';

describe('TopProductsList', () => {
  it('should display only the top 5 products', () => {
    // 1. Gumawa ng mock data na kailangan ng component
    const mockData = [
      { name: 'Package B', sold: 50 },
      { name: 'Package A', sold: 45 },
      { name: 'Ensaymada', sold: 40 },
      { name: 'Cupcake', sold: 35 },
      { name: 'Brownies', sold: 30 }
    ];

    // 2. I-pass ang mock data sa prop
    render(<TopProductsList data={mockData} />);

    // Ngayon, mahahanap na ng test ang mga elements na ito
    expect(screen.getByText('Package B')).toBeInTheDocument();
    expect(screen.getByText('Package A')).toBeInTheDocument();
    expect(screen.getByText('Ensaymada')).toBeInTheDocument();
    expect(screen.getByText('Cupcake')).toBeInTheDocument();
    expect(screen.getByText('Brownies')).toBeInTheDocument();
  });

  it('should render the empty state when no data is available', () => {
    render(<TopProductsList data={[]} />); // Siguraduhing empty array ang data

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByText(/No product data available/i)
    ).toBeInTheDocument();
  });
});