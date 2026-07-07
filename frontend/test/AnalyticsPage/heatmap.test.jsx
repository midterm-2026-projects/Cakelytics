import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderVolumeHeatmap from '../../src/components/Analytics/heatmap';

describe('Order Volume Heatmap', () => {
  it('should render the empty state message when no data is provided', () => {
    render(<OrderVolumeHeatmap data={[]} days={[]} />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/no order volume data available/i)).toBeTruthy();
  });
});