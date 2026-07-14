import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RawTab from '../../../src/components/inventory/RawTab';
import { useApp } from '../../../src/context/AppContext';

vi.mock('../../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../../src/components/ui', () => ({
  useToast: () => ({ show: vi.fn() }),
  Button: ({ children, onClick, disabled }) => <button onClick={onClick} disabled={disabled}>{children}</button>,
  Card: ({ children }) => <div>{children}</div>,
  Table: ({ children }) => <table><tbody>{children}</tbody></table>,
  Tr: ({ children }) => <tr>{children}</tr>,
  Td: ({ children }) => <td>{children}</td>,
  Badge: ({ children }) => <span>{children}</span>,
  LevelBar: () => <div>Level</div>,
  Modal: ({ children, isOpen, footer }) => isOpen ? <div>{children}{footer && <div>{footer}</div>}</div> : null,
  Input: ({ label, onChange, value, type, min }) => (
    <label>{label}<input value={value} onChange={onChange} type={type} min={min} /></label>
  ),
  Select: ({ label, children, onChange, value }) => (
    <label>{label}<select value={value} onChange={onChange}>{children}</select></label>
  ),
  ConfirmModal: ({ isOpen, onConfirm }) => isOpen ? <button onClick={onConfirm}>Confirm Delete</button> : null,
  Pagination: () => null,
}));

describe('RawTab Component', () => {
  const mockIngredients = [
    { id: 'ing-1', name: 'All-purpose Flour', stock: 20, min: 5, unit: 'kg', costPerUnit: 60 },
    { id: 'ing-2', name: 'White Sugar', stock: 8, min: 10, unit: 'kg', costPerUnit: 85 },
  ];

  it('should render all ingredients from context including name and stock quantity', () => {
    useApp.mockReturnValue({ ingredients: mockIngredients });
    render(<RawTab />);

    expect(screen.getAllByText('All-purpose Flour').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('White Sugar').length).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
  });

  it('should fall back to mock ingredient data when context returns an empty array', () => {
    useApp.mockReturnValue({ ingredients: [] });
    render(<RawTab />);

    expect(screen.getAllByText('All-Purpose Flour').length).toBeGreaterThanOrEqual(1);
  });

  it('should open the restock modal with the edit-mode label when Restock is clicked', () => {
    useApp.mockReturnValue({ ingredients: mockIngredients });
    render(<RawTab />);

    fireEvent.click(screen.getAllByText('Restock')[0]);

    expect(screen.getByLabelText(/Dami na Idadagdag/i)).toBeInTheDocument();
  });

  it('should call restockIngredient with the added quantity when restocking', () => {
    // NOTE: ang totoong context function na tinatawag ng RawTab component
    // ay "restockIngredient", hindi "updateIngredient" — at 2 args lang
    // (id, data) ang ipinapasa, hindi 4.
    const restockIngredientMock = vi.fn();
    useApp.mockReturnValue({ ingredients: mockIngredients, restockIngredient: restockIngredientMock });
    render(<RawTab />);

    fireEvent.click(screen.getAllByText('Restock')[0]);

    const qtyInput = screen.getByLabelText(/Dami na Idadagdag/i);
    fireEvent.change(qtyInput, { target: { value: '5' } });

    fireEvent.click(screen.getByText('Update Stock'));

    expect(restockIngredientMock).toHaveBeenCalledWith(
      'ing-1',
      expect.objectContaining({ added_qty: 5 })
    );
  });

  it('should call addIngredient with the correct initial data when a new ingredient form is submitted', () => {
    const addIngredientMock = vi.fn();
    useApp.mockReturnValue({ ingredients: mockIngredients, addIngredient: addIngredientMock });
    render(<RawTab />);

    fireEvent.click(screen.getByText('Add New Ingredient'));

    fireEvent.change(screen.getByLabelText(/Ingredient Name/i), { target: { value: 'Baking Powder' } });
    fireEvent.change(screen.getByLabelText(/Kasalukuyang Stock/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Minimum Safety Stock/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Save Ingredient'));

    // NOTE: totoong field names na ginagamit ng component sa create-mode
    // payload (stock_quantity / minimum_stock), hindi "stock"/"min".
    expect(addIngredientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Baking Powder',
        stock_quantity: 3,
        minimum_stock: 1,
        category: 'Raw Material',
      })
    );
  });

  it('should call deleteIngredient with the correct ingredient id when deletion is confirmed', () => {
    const deleteIngredientMock = vi.fn();
    useApp.mockReturnValue({ ingredients: mockIngredients, deleteIngredient: deleteIngredientMock });
    render(<RawTab />);

    fireEvent.click(screen.getAllByText('Delete')[0]);
    fireEvent.click(screen.getByText('Confirm Delete'));

    expect(deleteIngredientMock).toHaveBeenCalledWith('ing-1');
  });

  it('should display the empty-state message when a search query matches zero ingredients', () => {
    useApp.mockReturnValue({ ingredients: mockIngredients });
    render(<RawTab />);

    fireEvent.change(screen.getByPlaceholderText('Search ingredient...'), {
      target: { value: 'Quinoa' },
    });

    expect(screen.getByText('Walang nahanap na ingredient.')).toBeInTheDocument();
  });
});