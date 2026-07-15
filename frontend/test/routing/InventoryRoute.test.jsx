import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from '../../src/App'; 

describe('Inventory Routing', () => {
  
  it('should render the Login Page when navigating to /login', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const loginBtn = await screen.findByRole('button', { name: /sign in/i });
    expect(loginBtn).toBeInTheDocument();
  });

  it('should render the Inventory Page when navigating to /inventory', async () => {
    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <App />
      </MemoryRouter>
    );

    const wasteLogTab = await screen.findByText(/Waste Log/i);
    expect(wasteLogTab).toBeInTheDocument();
  });

  it('should navigate from the Sidebar to the Inventory page', async () => {
    const user = userEvent.setup();
    
    // Magsisimula tayo sa ibang admin page para ma-test ang pag-click sa Sidebar
    // Halimbawa, magsisimula tayo sa /pos
    render(
      <MemoryRouter initialEntries={['/pos']}>
        <App />
      </MemoryRouter>
    );

    const inventoryLink = await screen.findByRole('link', { name: /inventory/i });
    await user.click(inventoryLink);

    // Pagkatapos ma-click ang sidebar link, dapat lalabas na ang Inventory page content
    const wasteLogTab = await screen.findByText(/Waste Log/i);
    expect(wasteLogTab).toBeInTheDocument();
  });

});