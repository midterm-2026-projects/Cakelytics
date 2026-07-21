import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from '../../src/App';

const withToken = () => localStorage.setItem('token', 'fake-test-token');

const renderRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe('inventory routes and connections', () => {

  // ── AUTHENTICATION ───────────────────────────────────────────
  it('should render the Login Page when navigating to /login', async () => {
    renderRoute('/login');
    const loginBtn = await screen.findByRole('button', { name: /sign in/i });
    expect(loginBtn).toBeInTheDocument();
  });

  // ── SIDEBAR NAVIGATION
  describe('Sidebar navigation links', () => {

    it('should navigate to Inventory when the Sidebar Inventory link is clicked', async () => {
      withToken();
      const user = userEvent.setup();
      renderRoute('/pos');

      const link = await screen.findByRole('link', { name: /inventory/i });
      await user.click(link);

      expect(await screen.findByText(/Waste Log/i)).toBeInTheDocument();
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should navigate to Point Of Sale when the Sidebar link is clicked', async () => {
      withToken();
      const user = userEvent.setup();
      renderRoute('/inventory');

      const link = await screen.findByRole('link', { name: /point of sale/i });
      await user.click(link);

      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should navigate to All Orders when the Sidebar link is clicked', async () => {
      withToken();
      const user = userEvent.setup();
      renderRoute('/inventory');

      const link = await screen.findByRole('link', { name: /all orders/i });
      await user.click(link);

      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should navigate to Product Management when the Sidebar link is clicked', async () => {
      withToken();
      const user = userEvent.setup();
      renderRoute('/inventory');

      const link = await screen.findByRole('link', { name: /product management/i });
      await user.click(link);

      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should navigate to Analytics when the Sidebar link is clicked', async () => {
      withToken();
      const user = userEvent.setup();
      renderRoute('/inventory');

      const link = await screen.findByRole('link', { name: /analytics/i });
      await user.click(link);

      expect(link).toHaveAttribute('aria-current', 'page');
    });

  });

  // ── FALLBACK ────────────────────────────────────────────────
  it('should render a 404 Not Found page for unknown routes', async () => {
    renderRoute('/maling-url');
    const notFoundMessage = await screen.findByText(/Page Not Found/i);
    expect(notFoundMessage).toBeInTheDocument();
  });

});