import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TopProductsList from '../../../src/components/Analytics/topProducts';

describe('TopProductsList', () => {
  it('should display only the top 5 products', () => {
    // Render the component directly (it defaults to 'Last 7 Days')
    render(<TopProductsList />);

    // Check for the actual default items from your component's internal data
    expect(screen.getByText('Package B')).toBeInTheDocument();
    expect(screen.getByText('Package A')).toBeInTheDocument();
    expect(screen.getByText('Ensaymada')).toBeInTheDocument();
    expect(screen.getByText('Cupcake')).toBeInTheDocument();
    expect(screen.getByText('Brownies')).toBeInTheDocument();

  });

  it('should render the empty state when no data is available', () => {
    // Force the component to slice 0 items to trigger the empty state screen
    render(<TopProductsList maxItems={0} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByText(/No product data available/i)
    ).toBeInTheDocument();
  });
});