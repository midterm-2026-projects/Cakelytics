import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import HeaderPOS from '../../src/components/POScomponents/HeaderPOS';

describe('HeaderPOS', () => {
beforeEach(() => {
  vi.useFakeTimers();
  // Set time to 10:35 PM local time (22:35 in 24-hour format)
  vi.setSystemTime(new Date('2025-08-15T22:35:00Z'));
});

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should render the POS title and user information', () => {
    render(<HeaderPOS userName="Test User" notificationCount={3} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Point of Sale');
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should shows the notification badge when notificationCount is greater than zero', () => {
    render(<HeaderPOS userName="Test User" notificationCount={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not show the notification badge when notificationCount is zero', () => {
    render(<HeaderPOS userName="Test User" notificationCount={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should display the current formatted date and time', () => {
    render(<HeaderPOS userName="Test User" notificationCount={1} />);

    expect(screen.getByText(/Aug 15, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/10:35:00 PM/)).toBeInTheDocument();
  });
});
