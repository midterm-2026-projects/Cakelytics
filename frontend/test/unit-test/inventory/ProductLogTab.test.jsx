import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductLogTab from '../../../src/components/inventory/ProductLogTab';
import { useApp } from '../../../src/context/AppContext';

vi.mock('../../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../../src/components/ui', () => ({
  Table: ({ children }) => <table><tbody>{children}</tbody></table>,
  Tr: ({ children }) => <tr>{children}</tr>,
  Td: ({ children }) => <td>{children}</td>,
  Card: ({ children }) => <div>{children}</div>,
  Pagination: () => <div data-testid="mock-pagination">Pagination</div>,
}));

describe('ProductLogTab Component', () => {
  const mockLogs = [
    { id: 'log-1', dt: '2026-06-23', product: 'Classic Vanilla Cake', produced: 5, yieldUnit: 'pcs' },
    { id: 'log-2', dt: '2026-06-22', product: 'Chocolate Fudge Cake', produced: 3, yieldUnit: 'pcs' },
    { id: 'log-3', dt: '2026-06-21', product: 'Ube Cheese Pandesal', produced: 24, yieldUnit: 'pcs' },
  ];

  it('should render all production log entries from context when data is available', () => {
    useApp.mockReturnValue({ productionLogs: mockLogs });
    render(<ProductLogTab />);
    expect(screen.getAllByText('Classic Vanilla Cake').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Chocolate Fudge Cake').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ube Cheese Pandesal').length).toBeGreaterThanOrEqual(1);
  });

  it('should render the produced quantity with the correct unit badge format (+N unit)', () => {
    useApp.mockReturnValue({ productionLogs: mockLogs });
    render(<ProductLogTab />);
    expect(screen.getAllByText('+5 pcs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('+3 pcs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('+24 pcs').length).toBeGreaterThanOrEqual(1);
  });

  it('should fall back to mock data and still render rows when context returns an empty array', () => {
    useApp.mockReturnValue({ productionLogs: [] });
    render(<ProductLogTab />);
    expect(screen.getAllByText('Chocolate Ensaymada').length).toBeGreaterThanOrEqual(1);
  });

  it('should display the empty-state message when a search query matches zero production records', () => {
    useApp.mockReturnValue({ productionLogs: mockLogs });
    render(<ProductLogTab />);

    const searchInput = screen.getByPlaceholderText('Search product...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Product XYZ' } });
    expect(screen.getByText('Walang nahanap na production record.')).toBeInTheDocument();
  });

  it('should display the no-records empty-state message when logs are present but search matches nothing', () => {
    useApp.mockReturnValue({ productionLogs: mockLogs });
    render(<ProductLogTab />);

    const searchInput = screen.getByPlaceholderText('Search product...');
    fireEvent.change(searchInput, { target: { value: 'ZZZZZZ_NO_MATCH' } });

    expect(screen.getByText('Walang nahanap na production record.')).toBeInTheDocument();
  });

  it('should show pagination and still filter correctly when more than 10 logs are loaded', () => {
    const lotsOfLogs = Array.from({ length: 12 }, (_, i) => ({
      id: `log-${i}`, dt: '2026-06-01', product: `Product ${i}`, produced: i + 1, yieldUnit: 'pcs',
    }));
    useApp.mockReturnValue({ productionLogs: lotsOfLogs });
    render(<ProductLogTab />);

    expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search product...');
    fireEvent.change(searchInput, { target: { value: 'Product 0' } });

    expect(screen.getAllByText('Product 0').length).toBeGreaterThanOrEqual(1);
  });
});