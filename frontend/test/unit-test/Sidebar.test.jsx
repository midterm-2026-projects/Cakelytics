import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../src/components/Sidebar';

function renderSidebar(props = {}) {
  return render(
    <MemoryRouter>
      <Sidebar onLogoutClick={() => {}} open={false} onClose={() => {}} {...props} />
    </MemoryRouter>
  );
}

describe('Left Sidebar component', () => {
  it('should renders the main navigation links', () => {
    renderSidebar();

    expect(screen.getByText('Point Of Sale')).toBeInTheDocument();
    expect(screen.getByText('All Orders')).toBeInTheDocument();
    expect(screen.getByText('Product Management')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should point to the correct routes', () => {
    renderSidebar();
   
    expect(screen.getByText('Point Of Sale').closest('a')).toHaveAttribute('href', '/pos');
    expect(screen.getByText('All Orders').closest('a')).toHaveAttribute('href', '/orders');
    expect(screen.getByText('Product Management').closest('a')).toHaveAttribute('href', '/products');
    expect(screen.getByText('Inventory').closest('a')).toHaveAttribute('href', '/inventory');
    expect(screen.getByText('Analytics').closest('a')).toHaveAttribute('href', '/analytics');
  });
  
});