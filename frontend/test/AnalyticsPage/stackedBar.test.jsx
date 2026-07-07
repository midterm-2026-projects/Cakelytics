import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StackedBar from '../../src/components/Analytics/stackedBar';

// ─── Mock data ───────────────────────────────────────────────────────
// Inayos ang format para maging Array of Objects (ito ang hinihingi ng Recharts)
const mockTrend = [
  { label: 'Mon', Sales: 20000, Expenses: 12000 },
  { label: 'Tue', Sales: 22000, Expenses: 13000 },
  { label: 'Wed', Sales: 12000, Expenses: 7000 },
];

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