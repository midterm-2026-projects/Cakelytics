import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FourKpi from '../../src/components/Analytics/fourKPI';

describe('FourKpi Component', () => {
  it('should display correctly formatted currency and percentage values based on period', () => {
   
    render(<FourKpi period="Last 7 Days" />);

    expect(screen.getByText('₱158,000')).toBeInTheDocument();
    expect(screen.getByText('₱88,500')).toBeInTheDocument();
    expect(screen.getByText('₱69,500')).toBeInTheDocument();
    expect(screen.getByText('44.0%')).toBeInTheDocument();
  });
});