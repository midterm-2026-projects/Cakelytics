import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecipeTab from '../../../src/components/inventory/RecipeTab';
import { useApp } from '../../../src/context/AppContext';

vi.mock('../../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../../src/components/ui', () => ({
  useToast: () => ({ show: vi.fn() }),
  Button: ({ children, onClick, className, disabled }) => (
    <button onClick={onClick} className={className} disabled={disabled}>{children}</button>
  ),
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Table: ({ children, columns }) => (
    <table>
      <thead>
        <tr>{columns?.map((c, i) => <th key={i}>{c.label}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  ),
  Tr: ({ children }) => <tr>{children}</tr>,
  Td: ({ children, align }) => <td style={{ textAlign: align }}>{children}</td>,
  Modal: ({ children, isOpen, title, footer }) => isOpen ? (
    <div>
      <h3>{title}</h3>
      {children}
      {footer && <div>{footer}</div>}
    </div>
  ) : null,
  Input: ({ label, value, onChange, type, placeholder }) => (
    <label>{label}<input value={value} onChange={onChange} type={type} placeholder={placeholder} /></label>
  ),
  Select: ({ label, children, value, onChange }) => (
    <label>{label}<select value={value} onChange={onChange}>{children}</select></label>
  ),
  ConfirmModal: ({ isOpen, onConfirm, title }) => isOpen ? (
    <div>
      <h4>{title}</h4>
      <button onClick={onConfirm}>Confirm Action Delete</button>
    </div>
  ) : null,
}));

// Mock para sa lucide-react icons upang hindi maging sagabal sa layout parsing
vi.mock('lucide-react', () => ({
  Plus: () => <span>Plus</span>,
  Trash2: () => <span>TrashIcon</span>,
  CheckCircle2: () => <span>ConfirmIcon</span>,
  ShoppingCart: () => <span>CartIcon</span>,
  Edit2: () => <span>EditIcon</span>,
  Search: () => <span>SearchIcon</span>,
}));

// NOTE: kinakailangan ng RecipeTab.jsx ang "formatPHP" mula sa context —
// ginagamit ito sa render (formatPHP(r.estimatedCost)) kahit bago pa
// buksan ang alinmang modal. Kung wala ito sa useApp.mockReturnValue,
// mag-cra-crash agad ang component sa mismong render, kaya bumabagsak
// LAHAT ng test sa suite na ito.
const formatPHP = (v) => `\u20b1${Number(v || 0).toFixed(2)}`;

describe('RecipeTab Component', () => {
  const mockRecipes = [
    {
      id: 'r-1',
      product: 'Chocolate Ensaymada',
      productId: 'p-1',
      estimatedCost: 150,
      yield: 12,
      yieldUnit: 'pcs',
      ingredients: [
        { name: 'All-Purpose Flour', qty: 2, unit: 'kg' },
        { name: 'Fresh Milk', qty: 1, unit: 'Liters' }
      ]
    }
  ];

  const mockIngredients = [
    { id: 'i-1', name: 'All-Purpose Flour', stock: 0, unit: 'kg' },
    { id: 'i-2', name: 'Fresh Milk', stock: 5, unit: 'Liters' }
  ];

  const mockProducts = [
    { id: 'p-1', name: 'Chocolate Ensaymada', stock: 10 }
  ];

  it('should show the shopping list banner when a recipe has insufficient stock', () => {
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      addRecipe: vi.fn(),
      updateRecipe: vi.fn(),
      deleteRecipe: vi.fn(),
      confirmBatch: vi.fn(),
      formatPHP,
    });

    render(<RecipeTab />);

    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    expect(screen.getAllByText(/All-Purpose Flour/i).length).toBeGreaterThanOrEqual(1);
  });

  it('should compute stock capacity as floor(stock / ingredientQty) * yield and handle zero capacity', () => {
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      formatPHP,
    });

    render(<RecipeTab />);

    expect(screen.getAllByText(/0 pcs/i).length).toBeGreaterThanOrEqual(1);
  });

  it('should call addRecipe with the correct product_id and yield_quantity when a new recipe is saved', () => {
    // NOTE: pinalitan na ang "Product Name" field mula text input patungong
    // dropdown ng existing products (naka-link sa backend product_id), at
    // ang aktwal na payload shape ngayon ay:
    // { product_id, yield_quantity, yield_unit, estimated_cost, ingredients }
    // — hindi na { product, yield }. Kailangan ding may kahit isang
    // ingredient row bago tumuloy ang save (may validation guard).
    const addRecipeMock = vi.fn();
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      addRecipe: addRecipeMock,
      formatPHP,
    });

    render(<RecipeTab />);

    fireEvent.click(screen.getByText(/add recipe/i));

    fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'p-1' } });
    fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '10' } });

    const comboboxes = screen.getAllByRole('combobox');
    // comboboxes[0] = Product Name; comboboxes[1] = ingredient/material row select
    fireEvent.change(comboboxes[1], { target: { value: 'i-1' } });

    const qtyInputs = screen.getAllByPlaceholderText('Qty');
    fireEvent.change(qtyInputs[0], { target: { value: '2' } });

    fireEvent.click(screen.getByText('Save Recipe'));

    expect(addRecipeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: 'p-1',
        yield_quantity: 10,
      })
    );
  });

  it('should call deleteRecipe with the correct recipe id when deletion is confirmed', () => {
    const deleteRecipeMock = vi.fn();
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      deleteRecipe: deleteRecipeMock,
      formatPHP,
    });

    render(<RecipeTab />);

    const trashButtons = screen.getAllByText('TrashIcon');
    fireEvent.click(trashButtons[0]);

    fireEvent.click(screen.getByText('Confirm Action Delete'));

    expect(deleteRecipeMock).toHaveBeenCalledWith('r-1');
  });
});