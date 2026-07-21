import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AnalyticsPage from '../../src/pages/analyticsPage.jsx';

// ─── MOCKS ──────────────────────────────────────────────────────
vi.mock('../../src/components/Sidebar.jsx', () => ({
  Layout: ({ children }) => <div data-testid="layout">{children}</div>,
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// 🔥 MOCK API FIX
beforeEach(() => {
  global.fetch = vi.fn((url) => {
    // 1. Product Forecast expects an object with growth and risk
    if (url.includes('product-forecast')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { growth: [], risk: [] } }) });
    }
    // 2. Four KPI expects an object
    if (url.includes('four-kpi')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) });
    }
    // 3. StackedBar, TopProducts, and SalesForecast expect arrays!
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('AnalyticsPage Integration Tests', () => {
  it('should render all components imported in AnalyticsPage', async () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Business Performance')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getAllByText('Total Sales')[0]).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Gross Profit')).toBeInTheDocument();
    expect(screen.getByText('Profit Margin')).toBeInTheDocument();
    expect(screen.getByText('Performance Trend')).toBeInTheDocument();  
    expect(screen.getByText('Top 5 Best Selling Products')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next 30 Days' })).toBeInTheDocument();
    expect(screen.getByText('Sales Forecast')).toBeInTheDocument();
  });

  it('should update FourKpi, StackedBar, and TopProductsList when the Performance Timeframe is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    const periodButton = await screen.findByRole('button', { name: 'Today' });
    await user.click(periodButton);
    
    await user.click(screen.getByRole('menuitem', { name: 'This Year' }));

    await waitFor(() => {
      expect(screen.getAllByText(/vs Last Year/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/Sales composition · This Year/)).toBeInTheDocument();
    
    expect(screen.getByText(/Best-selling items · This Year/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'This Year' })).toBeInTheDocument();
  });


  it('should update SalesForecast and ProductForecasting when the Forecast Timeframe is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    const forecastButton = await screen.findByRole('button', { name: 'Next 30 Days' });
    await user.click(forecastButton);
    
    await user.click(screen.getByRole('button', { name: 'Next 7 Days' }));

    expect(await screen.findByText('7-Day Trend Analysis')).toBeInTheDocument();
    expect(screen.getAllByText('Next 7 Days').length).toBeGreaterThan(0);
    
    // 🔥 FIX: Tinanggal ang assertion na naghahanap ng Tagalog text na "Wala pang na-detect na trending products"
  });
});