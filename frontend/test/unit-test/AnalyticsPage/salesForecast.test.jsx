import { describe, it,} from 'vitest';
import { render } from '@testing-library/react';
import SalesForecast from '../../../src/components/Analytics/salesForecast';

describe('SalesForecast Component', () => {
  it('should render the chart correctly given valid sales forecast data.', () => {
    const validData = [
      { label: 'Jan 1', isToday: false, actualSales: 15000, forecastSales: null },
      { label: 'Jan 2', isToday: true, actualSales: 16000, forecastSales: 16500 },
      { label: 'Jan 3', isToday: false, actualSales: null, forecastSales: 17000 }
    ];

    render(<SalesForecast data={validData} />);

  });
});