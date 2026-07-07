import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import HeaderPOS from '../../../src/components/POScomponents/HeaderPOS';

describe('HeaderPOS', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Inalis ang 'Z' para basahin ito bilang local time
    vi.setSystemTime(new Date('2025-08-15T22:35:00'));
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

  it('should not show the notification badge when notificationCount is greater than zero', () => {
    render(<HeaderPOS userName="Test User" notificationCount={5} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should display the current formatted date and time', () => {
    render(<HeaderPOS userName="Test User" notificationCount={1} />);

    // Paggamit ng function sa loob ng getByText para mas sigurado 
    // na mahahanap nito ang text kahit may slight differences sa format
    expect(screen.getByText((content) => content.includes('Aug 15, 2025'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('10:35:00 PM'))).toBeInTheDocument();
  });
});