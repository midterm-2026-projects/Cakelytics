import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InventoryPage from '../../src/pages/InventoryPage';
import { useApp } from '../../src/context/AppContext';

vi.mock('../../src/context/AppContext', () => ({
  useApp: vi.fn(),
}));


vi.mock('../../src/components/ui/index', () => ({
  useToast: () => ({ show: vi.fn() }),
  Button: ({ children, onClick, className, disabled }) => (
    <button onClick={onClick} className={className} disabled={disabled}>{children}</button>
  ),
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Table: ({ children, columns }) => (
    <table>
      <thead><tr>{columns?.map((c, i) => <th key={i}>{c.label}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  ),
  Tr: ({ children }) => <tr>{children}</tr>,
  Td: ({ children, align }) => <td style={{ textAlign: align }}>{children}</td>,
  Modal: ({ children, isOpen, title, subtitle, footer }) => isOpen ? (
    <div>
      {title && <h3>{title}</h3>}
      {subtitle && <p>{subtitle}</p>}
      {children}
      {footer && <div>{footer}</div>}
    </div>
  ) : null,
  Input: ({ label, value, onChange, type, placeholder, min, step, max }) => (
    <label>{label}<input value={value} onChange={onChange} type={type} placeholder={placeholder} min={min} step={step} max={max} /></label>
  ),
  Select: ({ label, children, value, onChange }) => (
    <label>{label}<select value={value} onChange={onChange}>{children}</select></label>
  ),
  Textarea: ({ label, value, onChange, placeholder, rows }) => (
    <label>{label}<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} /></label>
  ),
  Badge: ({ children }) => <span>{children}</span>,
  LevelBar: () => <div>LevelBar</div>,
  ConfirmModal: ({ isOpen, onConfirm, title, message }) => isOpen ? (
    <div>
      {title && <h4>{title}</h4>}
      {message && <p>{message}</p>}
      <button onClick={onConfirm}>Confirm Delete</button>
    </div>
  ) : null,
  Pagination: () => <div data-testid="mock-pagination">Pagination</div>,
}));


vi.mock('lucide-react', () => ({
  Plus: () => <span>IconPlus</span>,
  Search: () => <span>IconSearch</span>,
  Filter: () => <span>IconFilter</span>,
  Trash2: () => <span>IconTrash</span>,
  CheckCircle2: () => <span>IconCheck</span>,
  ShoppingCart: () => <span>IconCart</span>,
  Edit2: () => <span>IconEdit</span>,
  AlertTriangle: () => <span>IconAlert</span>,
}));

describe('InventoryPage Inter-Component Integration (Real Child Tabs)', () => {
  const mockIngredients = [
    { id: 'ing-1', name: 'All-purpose Flour', stock: 20, min: 5, unit: 'kg', costPerUnit: 60 },
  ];

  const mockMaterials = [
    { id: 'mat-1', name: 'Balloons', stock: 100, min: 20, unit: 'pcs', costPerUnit: 5 },
  ];

const mockProducts = [
    { id: '123e4567-e89b-42d3-a456-426614174000', name: 'Ensaymada', stock: 5, estimatedCost: 200 },
  ];

  const mockRecipes = [
    {
      id: '987fcdeb-51a2-43d7-9012-345678901234',
      productId: '123e4567-e89b-42d3-a456-426614174000', 
      product: 'Ensaymada',
      estimatedCost: 100,
      yield: 10,
      yieldUnit: 'pcs',
      ingredients: [{ name: 'All-purpose Flour', qty: 1, unit: 'kg' }],
    },
  ];

  const todayISO = new Date().toISOString();
  const mockProductionLogs = [
    { id: 'log-1', dt: todayISO, product: 'Ensaymada', produced: 5, yieldUnit: 'pcs' },
    { id: 'log-2', dt: '2020-01-01T00:00:00.000Z', product: 'Old Batch', produced: 2, yieldUnit: 'pcs' },
  ];

  let contextFns;

  beforeEach(() => {
    contextFns = {
      addIngredient: vi.fn(),
      restockIngredient: vi.fn(),
      deleteIngredient: vi.fn(),
      addMaterial: vi.fn(),
      restockMaterial: vi.fn(),
      deleteMaterial: vi.fn(),
      addRecipe: vi.fn(),
      updateRecipe: vi.fn(),
      deleteRecipe: vi.fn(),
      confirmBatch: vi.fn(),
      logWaste: vi.fn(),
      formatPHP: (v) => `\u20b1${Number(v || 0).toFixed(2)}`,
    };

    useApp.mockReturnValue({
      ingredients: mockIngredients,
      materials: mockMaterials,
      recipes: mockRecipes,
      products: mockProducts,
      productionLogs: mockProductionLogs,
      wasteLogs: [],
      ...contextFns,
    });
  });

  // ─── RAW INGREDIENTS SUB-TAB ───
  describe('Raw Ingredients sub-tab', () => {

    it('should trigger error if added quantity during restock is zero or negative', () => {
      render(<InventoryPage />);

      fireEvent.click(screen.getAllByText('Restock')[0]);

      fireEvent.change(screen.getByLabelText(/Dami na Idadagdag/i), { target: { value: '0' } });
      fireEvent.click(screen.getByText('Update Stock'));

      expect(contextFns.restockIngredient).not.toHaveBeenCalled();
    });

    it('should not call addIngredient and should trigger error if inputs are invalid (negative stock or blank name)', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Add New Ingredient'));

      fireEvent.change(screen.getByLabelText('Ingredient Name'), { target: { value: '   ' } });
      fireEvent.change(screen.getByLabelText(/Kasalukuyang Stock/i), { target: { value: '5' } });
      fireEvent.click(screen.getByText('Save Ingredient'));
      
      expect(contextFns.addIngredient).not.toHaveBeenCalled();

      fireEvent.change(screen.getByLabelText('Ingredient Name'), { target: { value: 'Salt' } });
      fireEvent.change(screen.getByLabelText(/Kasalukuyang Stock/i), { target: { value: '-5' } });
      fireEvent.click(screen.getByText('Save Ingredient'));
      
      expect(contextFns.addIngredient).not.toHaveBeenCalled();
    });
    it('should render the real RawTab with ingredient data and filter via search', () => {
      render(<InventoryPage />);

      expect(screen.getAllByText('All-purpose Flour').length).toBeGreaterThanOrEqual(1);

      fireEvent.change(screen.getByPlaceholderText('Search ingredient...'), {
        target: { value: 'Nonexistent' },
      });
      expect(screen.getByText('Walang nahanap na ingredient.')).toBeInTheDocument();
    });

    it('should call addIngredient with the correct payload when a new ingredient is added', () => {
      render(<InventoryPage />);

      fireEvent.click(screen.getByText('Add New Ingredient'));

      fireEvent.change(screen.getByLabelText('Ingredient Name'), { target: { value: 'Baking Powder' } });
      fireEvent.change(screen.getByLabelText(/Kasalukuyang Stock/i), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText(/Minimum Safety Stock/i), { target: { value: '1' } });

      fireEvent.click(screen.getByText('Save Ingredient'));

      expect(contextFns.addIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Baking Powder',
          stock_quantity: 3,
          minimum_stock: 1,
          category: 'Raw Material',
        })
      );
    });

    it('should call restockIngredient with the added quantity when restocking an existing ingredient', () => {
      render(<InventoryPage />);

      fireEvent.click(screen.getAllByText('Restock')[0]);
      fireEvent.change(screen.getByLabelText(/Dami na Idadagdag/i), { target: { value: '5' } });
      fireEvent.click(screen.getByText('Update Stock'));

      expect(contextFns.restockIngredient).toHaveBeenCalledWith(
        'ing-1',
        expect.objectContaining({ added_qty: 5 })
      );
    });

    it('should call deleteIngredient with the correct id after confirming deletion', () => {
      render(<InventoryPage />);

      fireEvent.click(screen.getAllByText('Delete')[0]);
      fireEvent.click(screen.getByText('Confirm Delete'));

      expect(contextFns.deleteIngredient).toHaveBeenCalledWith('ing-1');
    });
  });

  // ─── CELEBRATION MATERIALS SUB-TAB ───
  describe('Celebration Materials sub-tab', () => {
    const goToCelebTab = () => fireEvent.click(screen.getByText('Celebration Materials'));

    it('should render the real CelebrationTab with material data and filter via search', () => {
      render(<InventoryPage />);
      goToCelebTab();

      expect(screen.getAllByText('Balloons').length).toBeGreaterThanOrEqual(1);

      fireEvent.change(screen.getByPlaceholderText('Search material...'), {
        target: { value: 'Confetti' },
      });
      expect(screen.getByText('Walang nahanap na material.')).toBeInTheDocument();
    });

    it('should call addMaterial with the correct payload when a new material is added', () => {
      render(<InventoryPage />);
      goToCelebTab();

      fireEvent.click(screen.getByText('Add New Material'));

      fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'Cake Topper' } });
      fireEvent.change(screen.getByLabelText(/Initial Stock Quantity/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Minimum Stock Level/i), { target: { value: '2' } });

      fireEvent.click(screen.getByText('Save Material'));

      expect(contextFns.addMaterial).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Cake Topper',
          stock_quantity: 10,
          minimum_stock: 2,
          category: 'Celebration Material',
        })
      );
    });

    it('should call restockMaterial with the added quantity when adding stock', () => {
      render(<InventoryPage />);
      goToCelebTab();

      fireEvent.click(screen.getAllByText('Add Stock')[0]);
      fireEvent.change(screen.getByLabelText(/Quantity na Idadagdag/i), { target: { value: '10' } });

      const btns = screen.getAllByText('Add Stock');
      fireEvent.click(btns[btns.length - 1]);

      expect(contextFns.restockMaterial).toHaveBeenCalledWith(
        'mat-1',
        expect.objectContaining({ added_qty: 10 })
      );
    });

    it('should call deleteMaterial with the correct id after confirming deletion', () => {
      render(<InventoryPage />);
      goToCelebTab();

      fireEvent.click(screen.getAllByText('Delete')[0]);
      fireEvent.click(screen.getByText('Confirm Delete'));

      expect(contextFns.deleteMaterial).toHaveBeenCalledWith('mat-1');
    });
  });

  // ─── RECIPE LOG SUB-TAB ───
  describe('Recipe Log sub-tab', () => {
    const goToRecipeTab = () => fireEvent.click(screen.getByText('Recipe Log'));
    it('should open the Edit modal and correctly populate fields with existing recipe data', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Recipe Log'));

      const editBtns = screen.getAllByText('IconEdit');
      fireEvent.click(editBtns[0].closest('button'));


      const productSelect = screen.getByLabelText('Product Name');
      expect(productSelect.value).toBe('123e4567-e89b-42d3-a456-426614174000');
      
      const yieldInput = screen.getByLabelText('Actual Yield per Batch');
      expect(yieldInput.value).toBe('10');


      const qtyInputs = screen.getAllByPlaceholderText('Qty');
      expect(qtyInputs[0].value).toBe('1');
    });
  it('should not call addRecipe if saving with negative yield or empty ingredients', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Recipe Log'));
      fireEvent.click(screen.getByText(/add recipe/i));

      fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '123e4567-e89b-42d3-a456-426614174000' } });
      fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '-5' } });
      fireEvent.click(screen.getByText('Save Recipe'));
      
      expect(contextFns.addRecipe).not.toHaveBeenCalled();

      fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '10' } });
      const trashIcons = screen.getAllByText('IconTrash');
      fireEvent.click(trashIcons[trashIcons.length - 1].closest('button'));
      
      fireEvent.click(screen.getByText('Save Recipe'));
      expect(contextFns.addRecipe).not.toHaveBeenCalled();
    });

    it('should hide the Confirm button if the Target Goal is zero or negative', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Recipe Log'));

      const targetInput = screen.getByPlaceholderText('Target Goal');
      fireEvent.change(targetInput, { target: { value: '-2' } });

      const confirmBtns = screen.queryAllByText(/Confirm/i);
      expect(confirmBtns.length).toBe(0);
    });
 
  it('should call confirmBatch with correct payload when target goal is met and Confirm is clicked', () => {
        render(<InventoryPage />);
        fireEvent.click(screen.getByText('Recipe Log'));

        const targetInput = screen.getByPlaceholderText('Target Goal');

        fireEvent.change(targetInput, { target: { value: '10' } });

        const confirmBtns = screen.getAllByText(/Confirm/i);
        fireEvent.click(confirmBtns[0]);

        expect(contextFns.confirmBatch).toHaveBeenCalledWith(
          expect.objectContaining({
            recipe_id: '987fcdeb-51a2-43d7-9012-345678901234', 
            product_id: '123e4567-e89b-42d3-a456-426614174000', 
            batches: 1,
            total_produced: 10
          })
        );
      });

    it('should render the real RecipeTab and populate the Product Name dropdown from context products', () => {
      render(<InventoryPage />);
      goToRecipeTab();

      expect(screen.getAllByText('Ensaymada').length).toBeGreaterThanOrEqual(1);

      fireEvent.click(screen.getByText(/add recipe/i));

      const productSelect = screen.getByLabelText('Product Name');
      expect(within(productSelect.closest('label')).getByText('Ensaymada')).toBeInTheDocument();
    });

    it('should call addRecipe with the correct product_id and yield_quantity after picking product and ingredient', () => {
      render(<InventoryPage />);
      goToRecipeTab();

      fireEvent.click(screen.getByText(/add recipe/i));

      fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '123e4567-e89b-42d3-a456-426614174000' } });
      fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '5' } });

      const comboboxes = screen.getAllByRole('combobox');
      fireEvent.change(comboboxes[1], { target: { value: 'ing-1' } });

      const qtyInputs = screen.getAllByPlaceholderText('Qty');
      fireEvent.change(qtyInputs[0], { target: { value: '1' } });

      fireEvent.click(screen.getByText('Save Recipe'));

      expect(contextFns.addRecipe).toHaveBeenCalledWith(
        expect.objectContaining({ product_id: '123e4567-e89b-42d3-a456-426614174000', yield_quantity: 5 })
      );
    });

    it('should call deleteRecipe with the correct id after confirming deletion', () => {
      render(<InventoryPage />);
      goToRecipeTab();

      const trashIcons = screen.getAllByText('IconTrash');
      fireEvent.click(trashIcons[0].closest('button'));

      fireEvent.click(screen.getByText('Confirm Delete'));

      expect(contextFns.deleteRecipe).toHaveBeenCalledWith('987fcdeb-51a2-43d7-9012-345678901234');
    });
  });

  // ─── PRODUCT LOG SUB-TAB ───
  describe('Product Log sub-tab', () => {
    const goToProductTab = () => fireEvent.click(screen.getByText('Product Log'));

    it('should display the Shopping List with correct shortfall when Target Goal exceeds available stock capacity', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Recipe Log'));

      const targetInput = screen.getByPlaceholderText('Target Goal');
      fireEvent.change(targetInput, { target: { value: '250' } });

      expect(screen.getByText('Shopping List')).toBeInTheDocument();

      expect(screen.getByText(/All-purpose Flour/i)).toBeInTheDocument();
      expect(screen.getByText('+5 kg')).toBeInTheDocument();
    });

    it('should not save recipe if a specific ingredient row has zero or negative quantity', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByText('Recipe Log'));
      fireEvent.click(screen.getByText(/add recipe/i));

      fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '123e4567-e89b-42d3-a456-426614174000' } });
      fireEvent.change(screen.getByLabelText('Actual Yield per Batch'), { target: { value: '10' } });

      const comboboxes = screen.getAllByRole('combobox');
      fireEvent.change(comboboxes[1], { target: { value: 'ing-1' } });

      const qtyInputs = screen.getAllByPlaceholderText('Qty');
      fireEvent.change(qtyInputs[0], { target: { value: '0' } }); 

      fireEvent.click(screen.getByText('Save Recipe'));

      expect(contextFns.addRecipe).not.toHaveBeenCalled();
    });

    it('should render the real ProductLogTab and list all production entries', () => {
      render(<InventoryPage />);
      goToProductTab();

      expect(screen.getAllByText('Ensaymada').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Old Batch').length).toBeGreaterThanOrEqual(1);
    });

    it('should filter to only today\u2019s entries when the "Today" date filter is selected', () => {
      render(<InventoryPage />);
      goToProductTab();

      const dateFilter = screen.getByRole('combobox');
      fireEvent.change(dateFilter, { target: { value: 'Today' } });

      expect(screen.getAllByText('Ensaymada').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('Old Batch')).not.toBeInTheDocument();
    });

    it('should show the empty-state message when search matches nothing', () => {
      render(<InventoryPage />);
      goToProductTab();

      fireEvent.change(screen.getByPlaceholderText('Search product...'), {
        target: { value: 'Nonexistent Product' },
      });

      expect(screen.getByText('Walang nahanap na production record.')).toBeInTheDocument();
    });
  });

  // ─── WASTE LOG MAIN TAB ───
  describe('Waste Log main tab', () => {
    const goToWasteTab = () => fireEvent.click(screen.getByRole('button', { name: 'Waste Log' }));

    it('should display zero Total Loss (Tantiya ng Lugi) and empty state initially when there are no logs', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Waste Log' }));

      expect(screen.getByText('₱0.00')).toBeInTheDocument();

      expect(screen.getByText('No waste records found.')).toBeInTheDocument();
    });

    it('should not submit Waste Log if item selection and quantity are blank', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Waste Log' }));
      
      fireEvent.click(screen.getByText('Unsold Product'));

      fireEvent.click(screen.getByText('Confirm Log'));
      
      expect(contextFns.logWaste).not.toHaveBeenCalled();
    });

    it('should not call logWaste if the inputted waste quantity exceeds current stock', () => {
      render(<InventoryPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Waste Log' }));

      fireEvent.click(screen.getByText('Spoiled Ingredient'));

      const ingSelect = screen.getByLabelText('Pumili ng Sangkap');
      fireEvent.change(ingSelect, { target: { value: 'All-purpose Flour' } });

      fireEvent.change(screen.getByLabelText('Dami ng Itatapon'), { target: { value: '50' } });
      fireEvent.click(screen.getByText('Confirm Log'));

      expect(contextFns.logWaste).not.toHaveBeenCalled();
    });

    it('should render the real WasteTab and hide the Stocks KPIs/sub-tabs', async () => { 
    render(<InventoryPage />);
    goToWasteTab();

    expect(await screen.findByRole('heading', { name: /Waste Log/i })).toBeInTheDocument();
    
    expect(screen.queryByText('Total Ingredients')).not.toBeInTheDocument();
    expect(screen.queryByText('Raw Ingredients')).not.toBeInTheDocument();
    });

    it('should populate the ingredient dropdown and call logWaste with the correct payload for ingredient waste', () => {
      render(<InventoryPage />);
      goToWasteTab();

      fireEvent.click(screen.getByText('Spoiled Ingredient'));

      const ingSelect = screen.getByLabelText('Pumili ng Sangkap');
      expect(within(ingSelect.closest('label')).getByText(/All-purpose Flour/)).toBeInTheDocument();

      fireEvent.change(ingSelect, { target: { value: 'All-purpose Flour' } });
      fireEvent.change(screen.getByLabelText('Dami ng Itatapon'), { target: { value: '2' } });
      fireEvent.click(screen.getByText('Confirm Log'));

      expect(contextFns.logWaste).toHaveBeenCalledWith(
        expect.objectContaining({
          waste_type: 'ingredient',
          item_name: 'All-purpose Flour',
          quantity: 2,
          cost: 120,
        })
      );
    });

    it('should populate the product dropdown and call logWaste with the correct payload for product waste', () => {
      render(<InventoryPage />);
      goToWasteTab();

      fireEvent.click(screen.getByText('Unsold Product'));

      const prodSelect = screen.getByLabelText('Select Product');
      expect(within(prodSelect.closest('label')).getByText(/Ensaymada/)).toBeInTheDocument();

      fireEvent.change(prodSelect, { target: { value: 'Ensaymada' } });
      fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });
      fireEvent.click(screen.getByText('Confirm Log'));

      expect(contextFns.logWaste).toHaveBeenCalledWith(
        expect.objectContaining({
          waste_type: 'product',
          item_name: 'Ensaymada',
          quantity: 2,
          cost: 400,
        })
      );
    });

    it('should populate the material dropdown and call logWaste with the correct payload for material waste', () => {
      render(<InventoryPage />);
      goToWasteTab();

      fireEvent.click(screen.getByText('Damaged Material'));

      const matSelect = screen.getByLabelText('Pumili ng Materyales');
      expect(within(matSelect.closest('label')).getByText(/Balloons/)).toBeInTheDocument();

      fireEvent.change(matSelect, { target: { value: 'Balloons' } });
      fireEvent.change(screen.getByLabelText('Quantity Lost'), { target: { value: '3' } });
      fireEvent.click(screen.getByText('Confirm Log'));

      expect(contextFns.logWaste).toHaveBeenCalledWith(
        expect.objectContaining({
          waste_type: 'material',
          item_name: 'Balloons',
          quantity: 3,
          cost: 15,
        })
      );
    });
  });

  // ─── TAB-SWITCHING PERSISTENCE ACROSS ACTUAL RENDERED TABS ───
  it('should preserve the active sub-tab state when toggling between Stocks and Waste Log', () => {
    render(<InventoryPage />);

    fireEvent.click(screen.getByText('Celebration Materials'));
    expect(screen.getAllByText('Balloons').length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText('Waste Log'));

    expect(screen.getByText('Spoiled Ingredient')).toBeInTheDocument();
    expect(screen.queryByText('Balloons')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Stocks'));
    expect(screen.getAllByText('Balloons').length).toBeGreaterThanOrEqual(1);
  });

  describe('Dynamic KPI Cards', () => {
    it('should display correct Dynamic KPI numbers for Stocks based on mock data', () => {
      render(<InventoryPage />);
      
      expect(screen.getByText('Total Ingredients')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); 

      expect(screen.getByText('Low Stock Ingredients')).toBeInTheDocument();
      expect(screen.getAllByText('0')[0]).toBeInTheDocument(); 
    });
  });

});