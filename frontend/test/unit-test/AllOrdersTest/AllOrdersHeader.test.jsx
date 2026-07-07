// src/components/AllOrdersComponents/OrdersPagination.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import OrdersPagination from '../../../src/components/AllOrdersComponents/Orderspagination';

it('should prev button is disabled on page 1 and enabled on page 2', () => {
  const { rerender } = render(
    <OrdersPagination currentPage={1} totalPages={3} onPageChange={() => {}} totalItems={20} pageSize={8} />
  );
  
  const prevButton = screen.getByRole('button', { name: /Prev/i }); // Siguraduhin ang accessibility name
  expect(prevButton.disabled).toBe(true);

  rerender(
    <OrdersPagination currentPage={2} totalPages={3} onPageChange={() => {}} totalItems={20} pageSize={8} />
  );
  expect(prevButton.disabled).toBe(false);
});

it('should call onPageChange with next page number when clicked', () => {
  const onPageChange = vi.fn();
  render(
    <OrdersPagination currentPage={1} totalPages={3} onPageChange={onPageChange} totalItems={20} pageSize={8} />
  );
  
  const nextButton = screen.getByRole('button', { name: /Next/i });
  fireEvent.click(nextButton);
  expect(onPageChange).toHaveBeenCalledWith(2);
});
