import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import OrdersPagination from '../../../src/components/AllOrdersComponents/Orderspagination'

it('should call onPageChange with next page number when clicked', () => {
  const onPageChange = vi.fn();
  render(<OrdersPagination currentPage={1} totalPages={3} onPageChange={onPageChange} totalItems={20} pageSize={8} />);
  const nextButton = screen.getByRole('button', { name: /Next/i }); // Palitan ayon sa icon kung wala pang text
  fireEvent.click(nextButton);
  expect(onPageChange).toHaveBeenCalledWith(2);
});