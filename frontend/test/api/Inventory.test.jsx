import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { server } from '../sample-backend/server';
import { resetMockData } from '../sample-backend/handlers/inventory.handlers';
import { AppProvider } from '../../src/context/AppContext';
import { ToastProvider } from '../../src/components/ui/index';
import InventoryPage from '../../src/pages/InventoryPage';

const AllTheProviders = ({ children }) => (
  <AppProvider>
    <ToastProvider>
      <MemoryRouter initialEntries={['/inventory']}>
        <Routes>
          <Route path="/inventory" element={children} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  </AppProvider>
);

const customRender = (ui) => render(ui, { wrapper: AllTheProviders });

describe('Inventory API Integration Tests', () => {

  beforeEach(() => {
    resetMockData();
  });

  // 1. RAW INGREDIENTS
  describe('Raw Ingredients', () => {

  describe('Create (POST /api/inventory/ingredients)', () => {
    it('should create a new ingredient successfully when all fields are valid', async () => {
      const user = userEvent.setup();
      customRender(<InventoryPage />);

      await user.click(screen.getByRole('button', { name: /Add New Ingredient/i }));

      const nameInput = await screen.findByPlaceholderText('e.g. Wash Sugar');
      await user.type(nameInput, 'Baking Soda');

      const stockLabel = await screen.findByText('Kasalukuyang Stock (Qty)');
      await user.type(stockLabel.parentElement.querySelector('input'), '10');

      const minLabel = await screen.findByText('Minimum Safety Stock');
      await user.type(minLabel.parentElement.querySelector('input'), '2');

      await user.click(screen.getByRole('button', { name: /Save Ingredient/i }));

      const createToast = await screen.findByText(/Raw ingredient added successfully/i, {}, { timeout: 5000 });
      expect(createToast).toBeInTheDocument();
    }, 15000);

    it('should show an error toast when the ingredient name is missing upon saving', async () => {
      const user = userEvent.setup();
      customRender(<InventoryPage />);

      await user.click(screen.getByRole('button', { name: /Add New Ingredient/i }));

      // Maglagay ng stock ngunit iwanang walang pangalan
      const stockLabel = await screen.findByText('Kasalukuyang Stock (Qty)');
      await user.type(stockLabel.parentElement.querySelector('input'), '10');

      const minLabel = await screen.findByText('Minimum Safety Stock');
      await user.type(minLabel.parentElement.querySelector('input'), '2');

      // I-click ang Save button (dahil hindi na ito disabled)
      await user.click(screen.getByRole('button', { name: /Save Ingredient/i }));

      // Tiyakin na lumabas ang tamang error toast message mula sa validation
      const errorToast = await screen.findByText(/Ingredient name is required/i);
      expect(errorToast).toBeInTheDocument();
    }, 10000);

    it('should show an error toast when the stock quantity is missing upon saving', async () => {
      const user = userEvent.setup();
      customRender(<InventoryPage />);

      await user.click(screen.getByRole('button', { name: /Add New Ingredient/i }));

      const nameInput = await screen.findByPlaceholderText('e.g. Wash Sugar');
      await user.type(nameInput, 'Baking Soda');

      const minLabel = await screen.findByText('Minimum Safety Stock');
      await user.type(minLabel.parentElement.querySelector('input'), '2');

      await user.click(screen.getByRole('button', { name: /Save Ingredient/i }));

      const errorToast = await screen.findByText(/Stock quantity is required/i);
      expect(errorToast).toBeInTheDocument();
    }, 10000);

    it('should show an error message when the server fails to create an ingredient', async () => {
      // I-force ang server na mag-return ng 500 error
      server.use(
        http.post('*/api/inventory/ingredients', () => {
          return HttpResponse.json({ message: 'Failed to create ingredient.' }, { status: 500 });
        })
      );

      const user = userEvent.setup();
      customRender(<InventoryPage />);

      await user.click(screen.getByRole('button', { name: /Add New Ingredient/i }));

      const nameInput = await screen.findByPlaceholderText('e.g. Wash Sugar');
      await user.type(nameInput, 'Baking Soda');

      const stockLabel = await screen.findByText('Kasalukuyang Stock (Qty)');
      await user.type(stockLabel.parentElement.querySelector('input'), '10');

      const minLabel = await screen.findByText('Minimum Safety Stock');
      await user.type(minLabel.parentElement.querySelector('input'), '2');

      await user.click(screen.getByRole('button', { name: /Save Ingredient/i }));

      // Dapat makuha at maipakita ang error na galing sa server
      const errorToast = await screen.findByText(/Failed to create ingredient/i, {}, { timeout: 5000 });
      expect(errorToast).toBeInTheDocument();
    }, 15000);
  });

    describe('Read (GET /api/inventory/ingredients)', () => {
      it('should display existing ingredients on page load', async () => {
        customRender(<InventoryPage />);

        const rawItems = await screen.findAllByText(/All-Purpose Flour/i, {}, { timeout: 8000 });
        expect(rawItems[0]).toBeInTheDocument();
      }, 10000);

      it('should show the no-results message when a search matches no ingredient', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);

        await screen.findAllByText(/All-Purpose Flour/i, {}, { timeout: 8000 });

        await user.type(screen.getByPlaceholderText('Search ingredient...'), 'Nonexistent Item');

        const emptyState = await screen.findByText('Walang nahanap na ingredient.');
        expect(emptyState).toBeInTheDocument();
      }, 10000);
    });

    describe('Update / Restock (PATCH /api/inventory/ingredients/:id/restock)', () => {
      it('should restock an existing ingredient successfully', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);

        const restockBtns = await screen.findAllByRole('button', { name: /Restock/i });
        await user.click(restockBtns[0]);

        const addQtyLabel = await screen.findByText('Dami na Idadagdag');
        await user.type(addQtyLabel.parentElement.querySelector('input'), '5');

        await user.click(screen.getByRole('button', { name: /Update Stock/i }));

        const restockToast = await screen.findByText(/\+5 kg na-add/i, {}, { timeout: 5000 });
        expect(restockToast).toBeInTheDocument();
      }, 15000);

      it('should show an error message when the server fails to restock an ingredient', async () => {
        server.use(
          http.patch('*/api/inventory/ingredients/:id/restock', () => {
            return HttpResponse.json({ message: 'Added quantity is required.' }, { status: 400 });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);

        const restockBtns = await screen.findAllByRole('button', { name: /Restock/i });
        await user.click(restockBtns[0]);

        const addQtyLabel = await screen.findByText('Dami na Idadagdag');
        await user.type(addQtyLabel.parentElement.querySelector('input'), '5');

        await user.click(screen.getByRole('button', { name: /Update Stock/i }));

        const errorToast = await screen.findByText(/Added quantity is required/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 15000);

      it('should show a validation error when the added quantity is empty upon saving', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);

        const restockBtns = await screen.findAllByRole('button', { name: /Restock/i });
        await user.click(restockBtns[0]);

        await screen.findByText('Dami na Idadagdag');

        await user.click(screen.getByRole('button', { name: /Update Stock/i }));

        const errorToast = await screen.findByText(/Added quantity is required/i);
        expect(errorToast).toBeInTheDocument();
      }, 10000);
    });

    describe('Delete (DELETE /api/inventory/ingredients/:id)', () => {
    it('should delete an ingredient successfully after confirming', async () => {
      const user = userEvent.setup();
      customRender(<InventoryPage />);

      const deleteBtns = await screen.findAllByRole('button', { name: /Delete/i });
      await user.click(deleteBtns[0]);

      await screen.findByText(/sa listahan\?/i, {}, { timeout: 5000 });

      const confirmBtns = screen.getAllByRole('button', { name: 'Delete' });
      await user.click(confirmBtns[confirmBtns.length - 1]);

      const deleteToast = await screen.findByText(/removed from ingredients/i, {}, { timeout: 5000 });
      expect(deleteToast).toBeInTheDocument();
    }, 15000);
    
    it('should show an error message when the server fails to delete an ingredient', async () => {
      // 1. I-force ang server na mag-error
      server.use(
        http.delete('*/api/inventory/ingredients/:id', () => {
          return HttpResponse.json({ message: 'Failed to delete ingredient' }, { status: 500 });
        })
      );

      const user = userEvent.setup();
      customRender(<InventoryPage />);

      // 2. I-trigger ang delete process
      const deleteBtns = await screen.findAllByRole('button', { name: /Delete/i });
      await user.click(deleteBtns[0]);

      await screen.findByText(/sa listahan\?/i, {}, { timeout: 5000 });
      const confirmBtns = screen.getAllByRole('button', { name: 'Delete' });
      await user.click(confirmBtns[confirmBtns.length - 1]);

      // 3. Hanapin ang error toast na nanggaling sa AppContext
      const errorToast = await screen.findByText(/Failed to delete ingredient/i, {}, { timeout: 5000 });
      expect(errorToast).toBeInTheDocument();
    }, 15000);

    });
  });

  // 2. CELEBRATION MATERIALS
  describe('Celebration Materials', () => {
    const goToCelebTab = async (user) => {
      const tabs = await screen.findAllByText(/Celebration Materials/i);
      await user.click(tabs[0]);
    };

    describe('Create (POST /api/inventory/materials)', () => {
      it('should create a new material successfully when all fields are valid', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        await user.click(screen.getByRole('button', { name: /Add New Material/i }));

        await user.type(await screen.findByPlaceholderText('e.g. Tarpaulin (2x3 ft)'), 'Confetti');

        const initStockLabel = await screen.findByText('Initial Stock Quantity');
        await user.type(initStockLabel.parentElement.querySelector('input'), '20');

        const minLevelLabel = await screen.findByText('Minimum Stock Level');
        await user.type(minLevelLabel.parentElement.querySelector('input'), '5');

        await user.click(screen.getByRole('button', { name: /Save Material/i }));

        const createToast = await screen.findByText(/Celebration material added/i, {}, { timeout: 5000 });
        expect(createToast).toBeInTheDocument();
      }, 15000);

it('should show a validation error when the item name is missing', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        await user.click(screen.getByRole('button', { name: /Add New Material/i }));

        const initStockLabel = await screen.findByText('Initial Stock Quantity');
        await user.type(initStockLabel.parentElement.querySelector('input'), '20');

        // I-click kahit walang item name
        await user.click(screen.getByRole('button', { name: /Save Material/i }));

        const errorToast = await screen.findByText(/Material name is required/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 10000);

      it('should show a validation error when the initial stock quantity is missing', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        await user.click(screen.getByRole('button', { name: /Add New Material/i }));

        await user.type(await screen.findByPlaceholderText('e.g. Tarpaulin (2x3 ft)'), 'Confetti');

        // I-click kahit walang stock quantity
        await user.click(screen.getByRole('button', { name: /Save Material/i }));

        const errorToast = await screen.findByText(/Initial stock is required/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 10000);

it('should show an error message when the server fails to create a material', async () => {
      // ✅ Ibalik natin ang server failure mock para dito sa test na ito
      server.use(
        http.post('*/api/inventory/materials', () => {
          return HttpResponse.json({ message: 'Failed to create material.' }, { status: 500 });
        })
      );

      const user = userEvent.setup();
      customRender(<InventoryPage />);
      await goToCelebTab(user);

      await user.click(screen.getByRole('button', { name: /Add New Material/i }));

      await user.type(await screen.findByPlaceholderText('e.g. Tarpaulin (2x3 ft)'), 'Confetti');

      const initStockLabel = await screen.findByText('Initial Stock Quantity');
      await user.type(initStockLabel.parentElement.querySelector('input'), '20');

      const minLevelLabel = await screen.findByText('Minimum Stock Level');
      await user.type(minLevelLabel.parentElement.querySelector('input'), '5');

      await user.click(screen.getByRole('button', { name: /Save Material/i }));

      // ✅ Hahanapin natin ang error toast na galing sa server response sa itaas
      const errorToast = await screen.findByText(/Failed to create material/i, {}, { timeout: 5000 });
      expect(errorToast).toBeInTheDocument();
    }, 15000);

    });

    describe('Read (GET /api/inventory/materials)', () => {
      it('should display existing materials on page load', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        const celebItems = await screen.findAllByText(/Printed Balloons/i, {}, { timeout: 8000 });
        expect(celebItems[0]).toBeInTheDocument();
      }, 10000);

      it('should show the no-results message when a search matches no material', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        await screen.findAllByText(/Printed Balloons/i, {}, { timeout: 8000 });

        await user.type(screen.getByPlaceholderText('Search material...'), 'Nonexistent Item');

        const emptyState = await screen.findByText('Walang nahanap na material.');
        expect(emptyState).toBeInTheDocument();
      }, 10000);
    });

    describe('Update / Add Stock (PUT /api/inventory/materials/:id)', () => {
  it('should add stock to an existing material successfully', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        const addStockBtns = await screen.findAllByRole('button', { name: /Add Stock/i });
        await user.click(addStockBtns[0]);

        const addQtyLabel = await screen.findByText(/Quantity na Idadagdag/i);
        await user.type(addQtyLabel.parentElement.querySelector('input'), '10');

        const modalHeading = await screen.findByText(/Add Stock — Printed Balloons/i);
        const modal = modalHeading.closest('.animate-modalIn');
        const confirmBtn = within(modal).getByRole('button', { name: /Add Stock/i });
        await user.click(confirmBtn);

        const successToast = await screen.findByText(/na-add sa/i, {}, { timeout: 5000 });
        expect(successToast).toBeInTheDocument();
      }, 15000);

  it('should show a validation error when the added quantity is empty upon saving', async () => {
      const user = userEvent.setup();
      customRender(<InventoryPage />);
      await goToCelebTab(user);

      const addStockBtns = await screen.findAllByRole('button', { name: /Add Stock/i });
      await user.click(addStockBtns[0]);

      await screen.findByText(/Quantity na Idadagdag/i);

      const confirmBtns = screen.getAllByRole('button', { name: /Add Stock/i });
      await user.click(confirmBtns[confirmBtns.length - 1]);

      const errorToast = await screen.findByText(/Added quantity is required/i);
      expect(errorToast).toBeInTheDocument();
    }, 10000);

      it('should show an error message when the server fails to restock a material', async () => {
        server.use(
          http.patch('*/api/inventory/materials/:id/restock', () => {
            return HttpResponse.json({ message: 'Failed to restock material.' }, { status: 500 });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        const addStockBtns = await screen.findAllByRole('button', { name: /Add Stock/i });
        await user.click(addStockBtns[0]);

        const addQtyLabel = await screen.findByText(/Quantity na Idadagdag/i);
        await user.type(addQtyLabel.parentElement.querySelector('input'), '10');

        const modalHeading = await screen.findByText(/Add Stock — Printed Balloons/i);
        const modal = modalHeading.closest('.animate-modalIn');
        const confirmBtn = within(modal).getByRole('button', { name: /Add Stock/i });
        await user.click(confirmBtn);

        const errorToast = await screen.findByText(/Failed to restock material/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 15000);
    });

    describe('Delete (DELETE /api/inventory/materials/:id)', () => {
      it('should delete a material successfully after confirming', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        const deleteBtns = await screen.findAllByRole('button', { name: /Delete/i });
        await user.click(deleteBtns[deleteBtns.length - 1]);

        const confirmBtns = await screen.findAllByRole('button', { name: 'Delete' });
        await user.click(confirmBtns[confirmBtns.length - 1]);

        const deleteToast = await screen.findByText(/deleted/i, {}, { timeout: 5000 });
        expect(deleteToast).toBeInTheDocument();
      }, 15000);

      it('should show an error message when the server fails to delete a material', async () => {
        server.use(
          http.delete('*/api/inventory/materials/:id', () => {
            return HttpResponse.json({ message: 'Failed to delete material' }, { status: 500 });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToCelebTab(user);

        const deleteBtns = await screen.findAllByRole('button', { name: /Delete/i });
        await user.click(deleteBtns[deleteBtns.length - 1]);

        const confirmBtns = await screen.findAllByRole('button', { name: 'Delete' });
        await user.click(confirmBtns[confirmBtns.length - 1]);

        const errorToast = await screen.findByText(/Failed to delete material/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 15000);
    });
  });

  // 3. RECIPE LOG

  describe('Recipe Log', () => {
    const goToRecipeTab = async (user) => {
      const tabs = await screen.findAllByText(/Recipe Log/i);
      await user.click(tabs[0]);
    };

    describe('Create (POST /api/inventory/recipes)', () => {
      it('should open and cancel the Add Recipe modal', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        const recipes = await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });
        expect(recipes[0]).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));
        const modals = await screen.findAllByText(/Edit Recipe|Add Recipe/i);
        expect(modals[0]).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Cancel/i }));
      }, 10000);

      it('should create a new recipe successfully when a product, yield, and ingredient are provided', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));

        const productLabel = await screen.findByText('Product Name');
        await user.selectOptions(productLabel.parentElement.querySelector('select'), 'p1');

        const yieldLabel = await screen.findByText('Actual Yield per Batch');
        await user.type(yieldLabel.parentElement.querySelector('input'), '5');

        const comboboxes = screen.getAllByRole('combobox');

        await user.selectOptions(comboboxes[1], 'i1');
        await user.type(screen.getByPlaceholderText('Qty'), '1');

        await user.click(screen.getByRole('button', { name: /Save Recipe/i }));

        const successToast = await screen.findByText(/Recipe added/i, {}, { timeout: 5000 });
        expect(successToast).toBeInTheDocument();
      }, 15000);

      it('should show a validation error and not submit when no product is selected', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));
        await user.click(screen.getByRole('button', { name: /Save Recipe/i }));

        const validationError = await screen.findByText(/Pumili muna ng product/i, {}, { timeout: 5000 });
        expect(validationError).toBeInTheDocument();
      }, 10000);

      it('should show a validation error when the yield is left empty or invalid', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));
        const productLabel = await screen.findByText('Product Name');
        await user.selectOptions(productLabel.parentElement.querySelector('select'), 'p1');

        await user.click(screen.getByRole('button', { name: /Save Recipe/i }));

        const validationError = await screen.findByText(/Invalid ang yield/i, {}, { timeout: 5000 });
        expect(validationError).toBeInTheDocument();
      }, 10000);

      it('should show a validation error when no ingredient row is filled in', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));
        const productLabel = await screen.findByText('Product Name');
        await user.selectOptions(productLabel.parentElement.querySelector('select'), 'p1');

        const yieldLabel = await screen.findByText('Actual Yield per Batch');
        await user.type(yieldLabel.parentElement.querySelector('input'), '5');

        await user.click(screen.getByRole('button', { name: /Save Recipe/i }));

        const validationError = await screen.findByText(/Kailangan ng kahit isang ingredient row/i, {}, { timeout: 5000 });
        expect(validationError).toBeInTheDocument();
      }, 10000);

      it('should show an error message when the server fails to save the recipe', async () => {
        server.use(
          http.post('*/api/inventory/recipes', () => {
            return HttpResponse.json({ message: 'Failed to save recipe.' }, { status: 500 });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        await user.click(screen.getByRole('button', { name: /Add Recipe/i }));
        const productLabel = await screen.findByText('Product Name');
        await user.selectOptions(productLabel.parentElement.querySelector('select'), 'p1');

        const yieldLabel = await screen.findByText('Actual Yield per Batch');
        await user.type(yieldLabel.parentElement.querySelector('input'), '5');

        const comboboxes = screen.getAllByRole('combobox');
        await user.selectOptions(comboboxes[1], 'i1');
        await user.type(screen.getByPlaceholderText('Qty'), '1');

        await user.click(screen.getByRole('button', { name: /Save Recipe/i }));

        const errorToast = await screen.findByText(/Failed to save recipe/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 15000);
    });

    describe('Read (GET /api/inventory/recipes)', () => {
      it('should display existing recipes on page load', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        const recipes = await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });
        expect(recipes[0]).toBeInTheDocument();
      }, 10000);

      it('should show the empty message when there are no recipes', async () => {
        server.use(
          http.get('*/api/inventory/recipes', () => {
            return HttpResponse.json({ success: true, data: [] });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        const emptyState = await screen.findByText(/Walang recipe na nahanap/i, {}, { timeout: 8000 });
        expect(emptyState).toBeInTheDocument();
      }, 10000);
    });

    describe('Delete (DELETE /api/inventory/recipes/:id)', () => {
      it('should delete a recipe successfully after confirming', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToRecipeTab(user);

        const recipeEls = await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });
        const row = recipeEls[recipeEls.length - 1].closest('tr');
        const rowButtons = within(row).getAllByRole('button');

        await user.click(rowButtons[rowButtons.length - 1]);

        const confirmBtn = await screen.findByRole('button', { name: 'Delete' });
        await user.click(confirmBtn);

        const successToast = await screen.findByText(/Recipe deleted/i, {}, { timeout: 5000 });
        expect(successToast).toBeInTheDocument();
      }, 15000);

  it('should show an error message when the server fails to delete the recipe', async () => {
          // 1. I-force ang server na mag-error
          server.use(
            http.delete('*/api/inventory/recipes/:id', () => {
              return HttpResponse.json({ message: 'Failed to delete recipe' }, { status: 500 });
            })
          );

          const user = userEvent.setup();
          customRender(<InventoryPage />);
          
          // Pumunta sa Recipe Tab
          const tabs = await screen.findAllByText(/Recipe Log/i);
          await user.click(tabs[0]);

          // 2. I-trigger ang delete
          const recipeEls = await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });
          const row = recipeEls[recipeEls.length - 1].closest('tr');
          const rowButtons = within(row).getAllByRole('button');
          await user.click(rowButtons[rowButtons.length - 1]);

          const confirmBtn = await screen.findByRole('button', { name: 'Delete' });
          await user.click(confirmBtn);

          // 3. Hanapin ang error toast
          const errorToast = await screen.findByText(/Failed to delete recipe/i, {}, { timeout: 5000 });
          expect(errorToast).toBeInTheDocument();
        }, 15000);
    });
  });

  // 4. PRODUCT LOG

  describe('Product Log', () => {
    const goToProductTab = async (user) => {
      const tabs = await screen.findAllByText(/Product Log/i);
      await user.click(tabs[0]);
    };

    describe('Read (GET /api/inventory/production)', () => {
      it('should display existing production log entries on page load', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToProductTab(user);

        const logs = await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });
        expect(logs[0]).toBeInTheDocument();
      }, 10000);

      it('should show the default empty-state message when there are no production logs', async () => {
        server.use(
          http.get('*/api/inventory/production', () => {
            return HttpResponse.json({ success: true, data: [] });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToProductTab(user);

        const emptyState = await screen.findByText(
          /Wala pang production record\. Mag-set ng target sa Recipe Log/i,
          {}, { timeout: 8000 }
        );
        expect(emptyState).toBeInTheDocument();
      }, 10000);

      it('should show the no-results message when a search matches no production record', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToProductTab(user);

        await screen.findAllByText(/Chocolate Cake/i, {}, { timeout: 8000 });

        await user.type(screen.getByPlaceholderText('Search product...'), 'Nonexistent Product');

        const emptyState = await screen.findByText('Walang nahanap na production record.');
        expect(emptyState).toBeInTheDocument();
      }, 10000);
    });
  });

  // 5. WASTE LOG

  describe('Waste Log', () => {
    const goToWasteTab = async (user) => {
      const tabs = await screen.findAllByText(/Waste Log/i);
      await user.click(tabs[0]);
    };

    describe('Create (POST /api/inventory/waste)', () => {
      it('should log ingredient waste successfully when all fields are valid', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToWasteTab(user);

        const wastes = await screen.findAllByText(/White Sugar/i, {}, { timeout: 8000 });
        expect(wastes[0]).toBeInTheDocument();

        const addBtn = screen.getByRole('button', { name: /Spoiled Ingredient/i });
        await user.click(addBtn);

        const selectLabel = await screen.findByText('Pumili ng Sangkap');
        await user.selectOptions(selectLabel.parentElement.querySelector('select'), 'All-Purpose Flour');

        const wasteQtyLabel = await screen.findByText('Dami ng Itatapon');
        await user.type(wasteQtyLabel.parentElement.querySelector('input'), '2');

        await user.click(screen.getByRole('button', { name: /Confirm Log/i }));

        const newWastes = await screen.findAllByText(/All-Purpose Flour/i, {}, { timeout: 5000 });
        expect(newWastes[0]).toBeInTheDocument();
      }, 15000);

      it('should show a validation error when no ingredient is selected', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToWasteTab(user);

        const addBtn = await screen.findByRole('button', { name: /Spoiled Ingredient/i });
        await user.click(addBtn);

        const wasteQtyLabel = await screen.findByText('Dami ng Itatapon');
        await user.type(wasteQtyLabel.parentElement.querySelector('input'), '2');

        await user.click(screen.getByRole('button', { name: /Confirm Log/i }));

        const [validationError] = await screen.findAllByText(
          (_, element) => /Mangyaring punan ang pangalan/i.test(element?.textContent ?? ''),
          {},
          { timeout: 5000 }
        );
        expect(validationError).toBeInTheDocument();
      }, 10000);

      it('should show an error when the requested waste quantity exceeds available stock', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToWasteTab(user);

        const addBtn = await screen.findByRole('button', { name: /Spoiled Ingredient/i });
        await user.click(addBtn);

        const selectLabel = await screen.findByText('Pumili ng Sangkap');
        await user.selectOptions(selectLabel.parentElement.querySelector('select'), 'All-Purpose Flour');

        const wasteQtyLabel = await screen.findByText('Dami ng Itatapon');
        await user.type(wasteQtyLabel.parentElement.querySelector('input'), '999999');

        await user.click(screen.getByRole('button', { name: /Confirm Log/i }));

        const insufficientStockError = await screen.findByText(
          /Hindi sapat ang stock!/i, {}, { timeout: 5000 }
        );
        expect(insufficientStockError).toBeInTheDocument();
      }, 10000);

      it('should show an error message when the server fails to log waste', async () => {

        server.use(
          http.post('*/api/inventory/waste', () => {
            return HttpResponse.json({ message: 'Failed to log waste' }, { status: 500 });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        
        const tabs = await screen.findAllByText(/Waste Log/i);
        await user.click(tabs[0]);

        const addBtn = await screen.findByRole('button', { name: /Spoiled Ingredient/i });
        await user.click(addBtn);

        const selectLabel = await screen.findByText('Pumili ng Sangkap');
        await user.selectOptions(selectLabel.parentElement.querySelector('select'), 'All-Purpose Flour');

        const wasteQtyLabel = await screen.findByText('Dami ng Itatapon');
        await user.type(wasteQtyLabel.parentElement.querySelector('input'), '2');

        await user.click(screen.getByRole('button', { name: /Confirm Log/i }));

        const errorToast = await screen.findByText(/Failed to log waste/i, {}, { timeout: 5000 });
        expect(errorToast).toBeInTheDocument();
      }, 15000);

    });

    describe('Read (GET /api/inventory/waste)', () => {
      it('should display existing waste log entries on page load', async () => {
        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToWasteTab(user);

        const wastes = await screen.findAllByText(/White Sugar/i, {}, { timeout: 8000 });
        expect(wastes[0]).toBeInTheDocument();
      }, 10000);

      it('should show the empty-state message when there are no waste log entries', async () => {
        server.use(
          http.get('*/api/inventory/waste', () => {
            return HttpResponse.json({ success: true, data: [] });
          })
        );

        const user = userEvent.setup();
        customRender(<InventoryPage />);
        await goToWasteTab(user);

        const emptyState = await screen.findByText('No waste records found.', {}, { timeout: 8000 });
        expect(emptyState).toBeInTheDocument();
      }, 10000);
    });
  });
});