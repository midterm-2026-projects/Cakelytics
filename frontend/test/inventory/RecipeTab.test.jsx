import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecipeTab from '../../src/components/inventory/RecipeTab';
import { useApp } from '../../src/context/AppContext';

vi.mock('../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../src/components/ui', () => ({
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

describe('RecipeTab Component', () => {
  const mockRecipes = [
    {
      id: 'r-1',
      product: 'Chocolate Ensaymada',
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
      confirmBatch: vi.fn()
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
    });

    render(<RecipeTab />);

    expect(screen.getAllByText(/0 pcs/i).length).toBeGreaterThanOrEqual(1);
  });

  it('should call addRecipe with correct shape when a new recipe is saved', () => {
    const addRecipeMock = vi.fn();
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      addRecipe: addRecipeMock
    });

    render(<RecipeTab />);

    // SELYADO: Gumamit ng regex selector para mahanap ang button kahit magkahiwalay ang text node ng Icon at "Add Recipe"
    fireEvent.click(screen.getByText(/add recipe/i));

    fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Spanish Bread' } });
    fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '10' } });

    fireEvent.click(screen.getByText('Save Recipe'));

    expect(addRecipeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        product: 'Spanish Bread',
        yield: 10
      })
    );
  });

  it('should call deleteRecipe with the correct recipe id when deletion is confirmed', () => {
    const deleteRecipeMock = vi.fn();
    useApp.mockReturnValue({
      recipes: mockRecipes,
      ingredients: mockIngredients,
      products: mockProducts,
      deleteRecipe: deleteRecipeMock
    });

    render(<RecipeTab />);

    const trashButtons = screen.getAllByText('TrashIcon');
    fireEvent.click(trashButtons[0]);

    fireEvent.click(screen.getByText('Confirm Action Delete'));

    expect(deleteRecipeMock).toHaveBeenCalledWith('r-1');
  });
});