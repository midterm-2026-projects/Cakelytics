import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForecastTimeframe from '../../src/components/Analytics/forecastTimeframe';

describe('ForecastTimeframe Component', () => {
  it('should render the three timeframe options (7 days, 30 days, 60 days)', () => {
    render(<ForecastTimeframe />);
    
    // Tinitingnan kung lumabas sa screen yung tatlong buttons
    expect(screen.getByText('Next 7 Days')).toBeInTheDocument();
    expect(screen.getByText('Next 30 Days')).toBeInTheDocument();
    expect(screen.getByText('Next 60 Days')).toBeInTheDocument();
  });
});