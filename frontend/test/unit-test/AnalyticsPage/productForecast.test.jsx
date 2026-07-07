import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductForecasting from '../../../src/components/Analytics/productForecast';

describe('ProductForecasting Component', () => {
  it('should render the list/chart of forecasted products correctly given valid input data.', () => {

    const validGrowthData = [
      { name: 'Mocha Dedication Cake', pct: 15, diff: 12, forecast: 92 }
    ];
    const validRiskData = [
      { name: 'Strawberry Cupcakes', pct: -12, diff: -8, forecast: 58 }
    ];

    render(<ProductForecasting growthData={validGrowthData} riskData={validRiskData} />);
    
    expect(screen.getByText('Mocha Dedication Cake')).toBeInTheDocument();
    expect(screen.getByText('+12 pcs')).toBeInTheDocument(); 

    expect(screen.getByText('Strawberry Cupcakes')).toBeInTheDocument();
    expect(screen.getByText('-8 pcs')).toBeInTheDocument(); 
  });
});