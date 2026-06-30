import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PerformanceTimeframe, { VIEWS } from '../../../src/pages/AnalyticsPage/performanceTimeframe';

describe('Performance Timeframe Selector', () => {
  it('should trigger timeframe change function with selected value', () => {
    const mockOnChange = vi.fn();
    
    render(<PerformanceTimeframe value="Day" onChange={mockOnChange} options={VIEWS} />);

    const dropdownButton = screen.getByText('Day');
    fireEvent.click(dropdownButton);

    const yesterdayOption = screen.getByText('Yesterday');
    fireEvent.click(yesterdayOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Yesterday');
  });
});