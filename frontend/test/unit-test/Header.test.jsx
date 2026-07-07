import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import Header from '../../src/components/Header'; 

vi.mock('../../src/context/AppContext', () => ({
  useApp: () => ({ orders: [] }) 
}));


describe('Header UI component', () => {
  it('should display the correct header label based on route', () => {
    const routeTests = [
      { path: '/analytics', expectedTitle: 'Analytics' },
      { path: '/pos', expectedTitle: 'Point of Sale' },
      { path: '/orders', expectedTitle: 'All Orders' },
      { path: '/products', expectedTitle: 'Product Management' },
      { path: '/inventory', expectedTitle: 'Inventory' },
    ];

    routeTests.forEach(({ path, expectedTitle }) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <Header onMenuClick={vi.fn()} />
        </MemoryRouter>
      );

      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveTextContent(expectedTitle);

      unmount();
    });
  });
});