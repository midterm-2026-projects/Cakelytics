import { http, HttpResponse } from 'msw';

// ─── SEED DATA (frozen snapshot — never mutated directly) ───
// `produced_at` / `logged_at` are captured once at module-load time so every
// reset restores the exact same timestamps, not "now" at reset-time.
const SEED = {
  ingredients: [{ id: 'i1', name: 'All-Purpose Flour', stock_quantity: 15, minimum_stock: 20, unit: 'kg', cost_per_unit: 60, category: 'Raw Material' }],
  materials: [{ id: 'm1', name: 'Printed Balloons', stock_quantity: 120, minimum_stock: 50, unit: 'pcs', cost_per_unit: 5, category: 'Celebration Material' }],
  products: [{ id: 'p1', name: 'Chocolate Cake', stock_quantity: 5, unit: 'pcs', estimated_cost: 250 }],
  recipes: [{ id: 'r1', product_id: 'p1', product_name: 'Chocolate Cake', yield_quantity: 1, yield_unit: 'pcs', estimated_cost: 250, recipe_ingredients: [] }],
  productionLogs: [{ id: 'prod1', produced_at: new Date().toISOString(), product_id: 'p1', product_name: 'Chocolate Cake', total_produced: 5, yield_unit: 'pcs' }],
  wasteLogs: [{ id: 'w1', logged_at: new Date().toISOString(), waste_type: 'ingredient', item_name: 'White Sugar', quantity: 2, unit: 'kg', cost: 170, reason: 'Spoiled', notes: '' }],
};

// ─── IN-MEMORY DATABASE (Sakop ang lahat ng 5 Tabs) ───
let mockIngredients = structuredClone(SEED.ingredients);
let mockMaterials = structuredClone(SEED.materials);
let mockProducts = structuredClone(SEED.products);
let mockRecipes = structuredClone(SEED.recipes);
let mockProductionLogs = structuredClone(SEED.productionLogs);
let mockWasteLogs = structuredClone(SEED.wasteLogs);

// Call this in a global `beforeEach` (test setup file, or the top of the
// integration test's outer `describe`) to give every test a clean, isolated
// copy of the mock DB. Fixes cross-test bleed / race conditions caused by
// un-awaited handlers (e.g. RawTab.jsx's handleSave) whose POST + fetchAll()
// chain can still be in-flight when the next test mounts a fresh AppProvider.
export function resetMockData() {
  mockIngredients = structuredClone(SEED.ingredients);
  mockMaterials = structuredClone(SEED.materials);
  mockProducts = structuredClone(SEED.products);
  mockRecipes = structuredClone(SEED.recipes);
  mockProductionLogs = structuredClone(SEED.productionLogs);
  mockWasteLogs = structuredClone(SEED.wasteLogs);
}

export const inventoryHandlers = [
  // ─── 1. RAW INGREDIENTS ───
  http.get('/api/inventory/ingredients', () => HttpResponse.json({ success: true, data: mockIngredients })),
  http.post('/api/inventory/ingredients', async ({ request }) => {
    const data = await request.json();
    const newItem = { ...data, id: `i-${Date.now()}` };
    mockIngredients.push(newItem);
    return HttpResponse.json({ success: true, data: newItem }, { status: 201 });
  }),
  http.patch('/api/inventory/ingredients/:id/restock', async ({ request, params }) => {
      const updates = await request.json();
      const index = mockIngredients.findIndex(i => i.id === params.id);
      if (index !== -1) {
        if (updates.added_qty) mockIngredients[index].stock_quantity += updates.added_qty;
        return HttpResponse.json({ success: true, data: mockIngredients[index] });
      }
      return new HttpResponse(null, { status: 404 });
    }),
  http.delete('/api/inventory/ingredients/:id', ({ params }) => {
    mockIngredients = mockIngredients.filter(i => i.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ─── 2. CELEBRATION MATERIALS ───
  http.get('/api/inventory/materials', () => HttpResponse.json({ success: true, data: mockMaterials })),
  http.post('/api/inventory/materials', async ({ request }) => {
    const data = await request.json();
    const newItem = { ...data, id: `m-${Date.now()}` };
    mockMaterials.push(newItem);
    return HttpResponse.json({ success: true, data: newItem }, { status: 201 });
  }),
  http.put('/api/inventory/materials/:id', async ({ request, params }) => {
    const updates = await request.json();
    const index = mockMaterials.findIndex(m => m.id === params.id);
    if (index !== -1) {
      if (updates.added_qty) mockMaterials[index].stock_quantity += updates.added_qty;
      else mockMaterials[index] = { ...mockMaterials[index], ...updates };
      return HttpResponse.json({ success: true, data: mockMaterials[index] });
    }
    return new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/inventory/materials/:id', ({ params }) => {
    mockMaterials = mockMaterials.filter(m => m.id !== params.id);
    return HttpResponse.json({ success: true });
  }),
// Sa loob ng inventoryHandlers array:
http.patch('/api/inventory/materials/:id/restock', async ({ request, params }) => {
  const updates = await request.json();
  const index = mockMaterials.findIndex(m => m.id === params.id);
  
  if (index !== -1) {
    if (updates.added_qty) {
      mockMaterials[index].stock_quantity += updates.added_qty;
    }
    return HttpResponse.json({ success: true, data: mockMaterials[index] });
  }
  return new HttpResponse(null, { status: 404 });
}),

  // ─── 3. RECIPES ───
  http.get('/api/inventory/recipes', () => HttpResponse.json({ success: true, data: mockRecipes })),
  http.post('/api/inventory/recipes', async ({ request }) => {
    const data = await request.json();
    const newItem = { ...data, id: `r-${Date.now()}` };
    mockRecipes.push(newItem);
    return HttpResponse.json({ success: true, data: newItem }, { status: 201 });
  }),
  http.delete('/api/inventory/recipes/:id', ({ params }) => {
    mockRecipes = mockRecipes.filter(r => r.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ─── 4. PRODUCTS & PRODUCTION LOGS ───
  http.get('/api/inventory/products', () => HttpResponse.json({ success: true, data: mockProducts })),
  http.get('/api/inventory/production', () => HttpResponse.json({ success: true, data: mockProductionLogs })),

  // ─── 5. WASTE LOGS ───
  http.get('/api/inventory/waste', () => HttpResponse.json({ success: true, data: mockWasteLogs })),
  http.post('/api/inventory/waste', async ({ request }) => {
    const data = await request.json();
    const newItem = { ...data, id: `w-${Date.now()}` };
    mockWasteLogs.push(newItem);
    return HttpResponse.json({ success: true, data: newItem }, { status: 201 });
  }),
];