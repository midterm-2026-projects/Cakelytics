import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StackedBar from '../../../src/pages/AnalyticsPage/stackedBar';

// ─── Mock data ───────────────────────────────────────────────────────
const mockTrend = {
  labels: ['Mon', 'Tue', 'Wed'],
  sales: [20000, 22000, 12000],
  expenses: [12000, 13000, 7000],
};

describe('Performance Trend Bar Chart Component ', () => {
  
  it('should render the chart container with correct texts, custom period, and legends', () => {
    render(<StackedBar data={mockTrend} period="Month" />);
    
    // Check Title & Subtitle
    expect(screen.getByRole('heading', { name: /performance trend/i })).toBeInTheDocument();
    expect(screen.getByText(/· Month/i)).toBeInTheDocument();

    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getAllByText('Expenses').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Profit').length).toBeGreaterThan(0);
  });

});