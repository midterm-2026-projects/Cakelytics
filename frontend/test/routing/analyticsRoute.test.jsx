import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from '../../src/App'; 

describe('Auth & Analytics Routing', () => {
  
  it('should render the Login Page when navigating to /login', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const loginBtn = await screen.findByRole('button', { name: /sign in/i });
    expect(loginBtn).toBeInTheDocument();
  });

  // 1. Inayos ang path mula /analyticspage patungong /analytics
  it('should render the Analytics Page when navigating to /analytics', async () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <App />
      </MemoryRouter>
    );

    const analyticsTitle = await screen.findByText(/Business Performance/i);
    expect(analyticsTitle).toBeInTheDocument();
  });

  it('should navigate from the Sidebar to the Analytics page', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <App />
      </MemoryRouter>
    );

    // 2. Siguraduhing ang name na hinahanap mo sa link ay tugma sa label sa Sidebar (halimbawa: "Analytics")
    // Kung ang label sa Sidebar mo ay "Analytics", ito ang dapat gamitin:
    const analyticsLink = await screen.findByRole('link', { name: /analytics/i });
    await user.click(analyticsLink);

    const analyticsTitle = await screen.findByText(/Business Performance/i);
    expect(analyticsTitle).toBeInTheDocument();
  });

});