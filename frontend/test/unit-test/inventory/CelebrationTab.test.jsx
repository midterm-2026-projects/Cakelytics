import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CelebrationTab from '../../../src/components/inventory/CelebrationTab';
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

describe('CelebrationTab Component', () => {
  const mockMaterials = [
    { id: 'mat-1', name: 'Printed Balloons', stock: 15, min: 5, unit: 'pcs', costPerUnit: 5 },
    { id: 'mat-2', name: 'Tarpaulin 2x3ft', stock: 2, min: 3, unit: 'pcs', costPerUnit: 150 },
  ];

  it('should render all celebration materials from context with correct names', () => {
    useApp.mockReturnValue({ materials: mockMaterials });
    render(<CelebrationTab />);

    expect(screen.getAllByText('Printed Balloons').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tarpaulin 2x3ft').length).toBeGreaterThanOrEqual(1);
  });

  it('should fall back to mock data and still display items when context returns an empty array', () => {
    useApp.mockReturnValue({ materials: [] });
    render(<CelebrationTab />);

    expect(screen.getAllByText('Printed Balloons (Red)').length).toBeGreaterThanOrEqual(1);
  });

  it('should filter the list to only matching items when a search query is entered', () => {
    useApp.mockReturnValue({ materials: mockMaterials });
    render(<CelebrationTab />);

    fireEvent.change(screen.getByPlaceholderText('Search material...'), {
      target: { value: 'Balloons' },
    });

    expect(screen.getAllByText('Printed Balloons').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Tarpaulin 2x3ft')).not.toBeInTheDocument();
  });

  it('should display the empty-state message when a search query matches zero materials', () => {
    useApp.mockReturnValue({ materials: mockMaterials });
    render(<CelebrationTab />);

    fireEvent.change(screen.getByPlaceholderText('Search material...'), {
      target: { value: 'Confetti Cannon' },
    });

    expect(screen.getByText('Walang nahanap na material.')).toBeInTheDocument();
  });

  it('should call addMaterial with the correct shape when a new material form is submitted', () => {
    const addMaterialMock = vi.fn();
    useApp.mockReturnValue({ materials: mockMaterials, addMaterial: addMaterialMock });
    render(<CelebrationTab />);

    fireEvent.click(screen.getByText('Add New Material'));

    fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'Custom Cake Topper' } });
    fireEvent.change(screen.getByLabelText(/Initial Stock Quantity/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Minimum Stock Level/i), { target: { value: '2' } });

    fireEvent.click(screen.getByText('Save Material'));

    // NOTE: totoong field names na ginagamit ng component sa create-mode payload
    // (stock_quantity / minimum_stock), hindi "stock"/"min".
    expect(addMaterialMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Custom Cake Topper',
        stock_quantity: 10,
        minimum_stock: 2,
        category: 'Celebration Material',
      })
    );
  });

  it('should call restockMaterial with the added quantity when add stock is submitted', () => {
    const restockMaterialMock = vi.fn();
    useApp.mockReturnValue({ materials: mockMaterials, restockMaterial: restockMaterialMock });
    render(<CelebrationTab />);

    fireEvent.click(screen.getAllByText('Add Stock')[0]);

    const qtyInput = screen.getByLabelText(/Quantity na Idadagdag/i);
    fireEvent.change(qtyInput, { target: { value: '10' } });

    const allAddStockBtns = screen.getAllByText('Add Stock');
    fireEvent.click(allAddStockBtns[allAddStockBtns.length - 1]);

    // NOTE: ang totoong context function na tinatawag ng component ay
    // "restockMaterial", hindi "updateMaterial" — at 2 args lang
    // (id, data) ang ipinapasa, hindi 4.
    expect(restockMaterialMock).toHaveBeenCalledWith(
      'mat-1',
      expect.objectContaining({ added_qty: 10 })
    );
  });

  it('should call deleteMaterial with the correct material id when deletion is confirmed', () => {
    const deleteMaterialMock = vi.fn();
    useApp.mockReturnValue({ materials: mockMaterials, deleteMaterial: deleteMaterialMock });
    render(<CelebrationTab />);

    fireEvent.click(screen.getAllByText('Delete')[0]);
    fireEvent.click(screen.getByText('Confirm Delete'));

    expect(deleteMaterialMock).toHaveBeenCalledWith('mat-1');
  });
});