import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import POSPage from '../../../src/pages/PosPage/POSPage';

describe('POSPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input, category buttons, and order summary', () => {
    render(<POSPage />);

    expect(screen.getByPlaceholderText(/search product/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pastry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /package/i })).toBeInTheDocument();
    expect(screen.getByText(/current order/i)).toBeInTheDocument();
    expect(screen.getByText(/0 items/i)).toBeInTheDocument();
  });

  it('filters products based on search term', () => {
    render(<POSPage />);

    const searchInput = screen.getByPlaceholderText(/search product/i);
    fireEvent.change(searchInput, { target: { value: 'Package A' } });

    expect(screen.getByText('Package A')).toBeInTheDocument();
    expect(screen.queryByText('Package B')).not.toBeInTheDocument();
  });

  it('shows customer details section when Pre-Order mode is selected', () => {
    render(<POSPage />);

    fireEvent.click(screen.getByRole('button', { name: /pre-order/i }));

    expect(screen.getByPlaceholderText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm pre-order/i)).toBeInTheDocument();
  });

  it('prevents adding Package products when mode is Now and shows alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<POSPage />);

    const packageProductCard = screen.getByText('Package A', { exact: true }).closest('div');
    expect(packageProductCard).toBeTruthy();

    const packageAddButton = within(packageProductCard).getByRole('button', { name: /add/i });
    fireEvent.click(packageAddButton);

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Kailangan ng lead time ng mga Package')
    );
    expect(screen.getByText(/0 items/i)).toBeInTheDocument();
  });

  it('adds Package products to cart in Pre-Order mode', () => {
    render(<POSPage />);

    fireEvent.click(screen.getByRole('button', { name: /pre-order/i }));

    const packageProductCard = screen.getByText('Package A', { exact: true }).closest('div');
    const packageAddButton = within(packageProductCard).getByRole('button', { name: /add/i });
    fireEvent.click(packageAddButton);

    expect(screen.getByText(/1 item/i)).toBeInTheDocument();

    const packageTextMatches = screen.getAllByText('Package A', { exact: true });
    expect(packageTextMatches).toHaveLength(2);
    expect(packageTextMatches[1]).toBeInTheDocument();
  });
});
