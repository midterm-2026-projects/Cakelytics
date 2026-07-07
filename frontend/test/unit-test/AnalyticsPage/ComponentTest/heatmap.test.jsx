import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderVolumeHeatmap from '../../../../src/components/Analytics/heatmap';

describe('Order Volume Heatmap', () => {
  it('should open the calendar dialog when the trigger button is clicked', () => {
    render(<OrderVolumeHeatmap />);
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

  it('should render the empty state message when no data is provided', () => {
    render(<OrderVolumeHeatmap data={[]} days={[]} />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/no order volume data available/i)).toBeTruthy();
  });
  
});

