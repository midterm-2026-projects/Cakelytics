import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FourKpi from '../../../../src/components/Analytics/fourKPI';

describe('FourKpi Component', () => {
  const mockKpiData = {
    sales: 158000, sDelta: 6.2,
    expenses: 88500, eDelta: 2.1,
    profit: 69500, pDelta: 11.4,
    margin: 44.0, mDelta: 1.4
  };

  it('should displays correctly formatted currency and percentage values passed via mock data', () => {
    render(<FourKpi kpi={mockKpiData} period="Week" />);

    expect(screen.getByText('₱158,000')).toBeInTheDocument();
    expect(screen.getByText('₱88,500')).toBeInTheDocument();
    expect(screen.getByText('₱69,500')).toBeInTheDocument();
    expect(screen.getByText('44.0%')).toBeInTheDocument();
  });
});