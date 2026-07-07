import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeatmapTimeframe from '../../../src/components/Analytics/heatmapTimeframe';

describe('HeatmapTimeframe (Timeframe Selector)', () => {
  it('should open the calendar dialog when the trigger button is clicked', () => {
    const weekStart = new Date();
    render(<HeatmapTimeframe weekStart={weekStart} onChange={() => {}} />);

    expect(
      screen.queryByRole('dialog', { name: /select week/i })
    ).toBeNull();

    const trigger = screen.getByRole('button', {
      name: /select week/i,
    });

    fireEvent.click(trigger);
    expect(
      screen.getByRole('dialog', { name: /select week/i })
    ).toBeInTheDocument();
  });
});