import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductForecasting from '../../../src/components/Analytics/productForecast';

describe('ProductForecasting Component', () => {
  it('should render the list/chart of forecasted products correctly given valid input data.', () => {

    // FORMAT FIX: Kailangan naka-wrap sa iisang "data" object ang growth at risk.
    const validData = {
      growth: [
        { name: 'Mocha Dedication Cake', pct: 15, diff: 12, forecast: 92 }
      ],
      risk: [
        { name: 'Strawberry Cupcakes', pct: -12, diff: -8, forecast: 58 }
      ]
    };

    render(<ProductForecasting data={validData} view="30d" />);
    
    expect(screen.getByText('Mocha Dedication Cake')).toBeInTheDocument();
    expect(screen.getByText('92 pcs')).toBeInTheDocument(); 
    // TEXT MATCH FIX: (+12) at hindi "+12 pcs" ang ni-render ng component
    expect(screen.getByText('(+12)')).toBeInTheDocument(); 

    expect(screen.getByText('Strawberry Cupcakes')).toBeInTheDocument();
    expect(screen.getByText('58 pcs')).toBeInTheDocument(); 
    // TEXT MATCH FIX: (-8) at hindi "-8 pcs"
    expect(screen.getByText('(-8)')).toBeInTheDocument(); 
  });
});