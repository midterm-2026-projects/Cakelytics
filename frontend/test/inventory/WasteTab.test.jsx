import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WasteTab from '../../src/components/inventory/WasteTab';
import { useApp } from '../../src/context/AppContext';

vi.mock('../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../src/components/ui', () => ({
  useToast: () => ({ show: vi.fn() }),
  Button: ({ children, onClick, className }) => <button onClick={onClick} className={className}>{children}</button>,
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Table: ({ children }) => <table><tbody>{children}</tbody></table>,
  Tr: ({ children }) => <tr>{children}</tr>,
  Td: ({ children }) => <td>{children}</td>,
  Badge: ({ children }) => <span>{children}</span>,
  Modal: ({ children, isOpen, title, footer }) => isOpen ? <div><h3>{title}</h3>{children}{footer && <div>{footer}</div>}</div> : null,
  Select: ({ label, children, value, onChange }) => (
    <label>{label}<select value={value} onChange={onChange}>{children}</select></label>
  ),
  Input: ({ label, value, onChange, type, min, step, max }) => (
    <label>{label}<input value={value} onChange={onChange} type={type} min={min} step={step} max={max} /></label>
  ),
  Textarea: ({ label, value, onChange, placeholder, rows }) => (
    <label>{label}<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} /></label>
  ),
  Pagination: () => <div>Pagination Layout</div>,
  ConfirmModal: ({ isOpen, onConfirm, title }) => isOpen ? <div><h4>{title}</h4><button onClick={onConfirm}>Confirm Delete</button></div> : null
}));

describe('WasteTab Component', () => {
  const mockIngredients = [
    { id: 'ing-1', name: 'Eggs', stock: 50, unit: 'pcs', costPerUnit: 10 },
  ];

  const mockProducts = [
    { id: 'prod-1', name: 'Chocolate Cake', stock: 10, estimatedCost: 450 },
  ];

  const mockMaterials = [
    { id: 'mat-1', name: 'Balloons', stock: 100, unit: 'pcs', costPerUnit: 20 },
  ];

  it('should call logWaste with estimated cost computed as costPerUnit * qty when logging ingredient waste', () => {
    const logWasteMock = vi.fn();
    useApp.mockReturnValue({
      wasteLogs: [],
      ingredients: mockIngredients,
      products: mockProducts,
      materials: mockMaterials,
      logWaste: logWasteMock,
    });
    render(<WasteTab />);

    fireEvent.click(screen.getByText('+ Spoiled Ingredient'));

    const selectEl = screen.getByLabelText('Pumili ng Sangkap');
    fireEvent.change(selectEl, { target: { value: 'Eggs' } });

    const qtyInput = screen.getByLabelText('Dami ng Itatapon');
    fireEvent.change(qtyInput, { target: { value: '3' } });

    fireEvent.click(screen.getByText('Confirm Log'));

    expect(logWasteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ingredient',
        item: 'Eggs',
        rawQty: 3,
        cost: 30,
      })
    );
  });

  it('should call logWaste with estimated cost computed when logging product waste', () => {
    const logWasteMock = vi.fn();
    useApp.mockReturnValue({
      wasteLogs: [],
      ingredients: mockIngredients,
      products: mockProducts,
      materials: mockMaterials,
      logWaste: logWasteMock,
    });
    render(<WasteTab />);

    fireEvent.click(screen.getByText('+ Unsold Product'));

    const selectEl = screen.getByLabelText('Select Product');
    fireEvent.change(selectEl, { target: { value: 'Chocolate Cake' } });

    const qtyInput = screen.getByLabelText('Quantity');
    fireEvent.change(qtyInput, { target: { value: '2' } });

    fireEvent.click(screen.getByText('Confirm Log'));

    expect(logWasteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'product',
        item: 'Chocolate Cake',
        rawQty: 2,
        cost: 900,
      })
    );
  });

  it('should call logWaste with estimated cost computed as costPerUnit * qty when logging material waste', () => {
    const logWasteMock = vi.fn();
    useApp.mockReturnValue({
      wasteLogs: [],
      ingredients: mockIngredients,
      products: mockProducts,
      materials: mockMaterials,
      logWaste: logWasteMock,
    });
    render(<WasteTab />);

    fireEvent.click(screen.getByText('Archive Material'));

    const selectEl = screen.getByLabelText('Pumili ng Materyales');
    fireEvent.change(selectEl, { target: { value: 'Balloons' } });

    const qtyInput = screen.getByLabelText('Quantity Lost');
    fireEvent.change(qtyInput, { target: { value: '5' } });

    fireEvent.click(screen.getByText('Confirm Log'));

    expect(logWasteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'material',
        item: 'Balloons',
        rawQty: 5,
        cost: 100,
      })
    );
  });

  it('should display the no-records empty state when logs array is empty and search returns no results', () => {
    useApp.mockReturnValue({
      wasteLogs: [],
      ingredients: mockIngredients,
      products: mockProducts,
      materials: mockMaterials,
    });
    render(<WasteTab />);

    expect(screen.getByText('No waste records found.')).toBeInTheDocument();
  });
});