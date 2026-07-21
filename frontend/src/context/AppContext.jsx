/* eslint-disable react-refresh/only-export-components */
// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../services/api';

export const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);
};

const AppContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = `${API_BASE}/inventory`;

const normalizeName = (value = '') => String(value).trim().toLowerCase();

const authFetch = (url, options = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export function AppProvider({ children }) {
  // ── State ──
  const [ingredients,    setIngredients]    = useState([]);
  const [materials,      setMaterials]      = useState([]);
  const [recipes,        setRecipes]        = useState([]);
  const [productionLogs, setProductionLogs] = useState([]);
  const [wasteLogs,      setWasteLogs]      = useState([]);
  const [products,       setProducts]       = useState([]);
  const [orders]                          = useState([]);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Network Fetch Loaders ──
  const fetchAll = async () => {
    setLoading(true);

    // Helper function para hindi mag-fail ang Promise.all kapag may error
    const safeFetch = async (url) => {
      try {
        const response = await authFetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        return { data: [] }; // Return empty data kung mag-error
      }
    };

    const [ing, mat, rec, prodLog, wst, prd] = await Promise.all([
      safeFetch(`${BASE_URL}/ingredients`),
      safeFetch(`${BASE_URL}/materials`),
      safeFetch(`${BASE_URL}/recipes`),
      safeFetch(`${BASE_URL}/production`),
      safeFetch(`${BASE_URL}/waste`),
      safeFetch(`${BASE_URL}/products`)
    ]);

    const normalizedIngredients = (ing.data || []).map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      stock: Number(item.stock_quantity ?? 0),
      min: Number(item.minimum_stock ?? 0),
      costPerUnit: Number(item.cost_per_unit ?? 0),
      stock_quantity: Number(item.stock_quantity ?? 0),
      minimum_stock: Number(item.minimum_stock ?? 0),
      cost_per_unit: Number(item.cost_per_unit ?? 0),
      category: item.category,
    }));

    const normalizedMaterials = (mat.data || []).map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      stock: Number(item.stock_quantity ?? 0),
      min: Number(item.minimum_stock ?? 0),
      costPerUnit: Number(item.cost_per_unit ?? 0),
      stock_quantity: Number(item.stock_quantity ?? 0),
      minimum_stock: Number(item.minimum_stock ?? 0),
      cost_per_unit: Number(item.cost_per_unit ?? 0),
      category: item.category,
    }));

    const normalizedRecipes = (rec.data || []).map(recipe => {
      const relatedProduct = Array.isArray(recipe.products)
        ? recipe.products[0]
        : recipe.products;

      return ({
        id: recipe.id,
        productId: recipe.product_id,
        product: relatedProduct?.name || recipe.product_name || '',
        estimatedCost: Number(recipe.estimated_cost ?? 0),
        yield: Number(recipe.yield_quantity ?? 0),
        yieldUnit: recipe.yield_unit || 'pcs',
        ingredients: (recipe.recipe_ingredients || []).map(ri => ({
          name: ri.item_name,
          qty: Number(ri.quantity ?? 0),
          unit: ri.unit,
          itemType: ri.item_type,
        })),
      });
    });

    const normalizedProducts = (prd.data || []).map(product => ({
      ...product,
      name: product.name || '',
      stock: Number(product.stock_quantity ?? product.stock ?? 0),
      stock_quantity: Number(product.stock_quantity ?? product.stock ?? 0),
      normalizedName: normalizeName(product.name),
    }));

    const normalizedProductionLogs = (prodLog.data || []).map(log => ({
      id: log.id,
      dt: log.produced_at,
      product: log.product_name,
      produced: Number(log.total_produced ?? 0),
      yieldUnit: log.yield_unit || 'pcs',
      batches: Number(log.batches ?? 0),
      recipeId: log.recipe_id,
      productId: log.product_id,
      notes: log.notes || '',
    }));

    setIngredients(normalizedIngredients);
    setMaterials(normalizedMaterials);
    setRecipes(normalizedRecipes);
    setProductionLogs(normalizedProductionLogs);
    setProducts(normalizedProducts);

    // Mapping para sa Waste
    setWasteLogs((wst.data || []).map(w => ({
      id: w.id,
      dt: w.logged_at,
      type: w.waste_type,
      item: w.item_name,
      qty: `${w.quantity} ${w.unit}`,
      cost: Number(w.cost),
      reason: w.reason,
      notes: w.notes
    })));

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const fetchOrders = async () => {};

  // ── Product actions ────
  const addProduct = async () => {};
  const updateProduct = async (id, data) => {
    const res = await authFetch(`${BASE_URL}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to update product'); }
    await fetchAll();
  };
  const deleteProduct = async () => {};
  const uploadProductImage = async () => {};

  // ── Order actions ────
  const addOrder = async () => {};
  const addOnlineOrder = async () => {};
  const updateOrderStatus = async () => {};

  // ── Ingredient actions ────
  const addIngredient = async (data) => {
    const res = await authFetch(`${BASE_URL}/ingredients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to add ingredient'); }
    await fetchAll();
  };
  const updateIngredient = async (id, data) => {
    const res = await authFetch(`${BASE_URL}/ingredients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to update ingredient'); }
    await fetchAll();
  };
  const deleteIngredient = async (id) => {
    const res = await authFetch(`${BASE_URL}/ingredients/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to delete ingredient'); }
    await fetchAll();
  };
  const restockIngredient = async (id, data) => {
    const res = await authFetch(`${BASE_URL}/ingredients/${id}/restock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to restock ingredient'); }
    await fetchAll();
  };

  // ── Material actions ────
  const addMaterial = async (data) => {
    const res = await authFetch(`${BASE_URL}/materials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to add material'); }
    await fetchAll();
  };
  const updateMaterial = async (id, data) => {
    const res = await authFetch(`${BASE_URL}/materials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to update material'); }
    await fetchAll();
  };
  const deleteMaterial = async (id) => {
    const res = await authFetch(`${BASE_URL}/materials/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to delete material'); }
    await fetchAll();
  };
  // Sa AppContext.jsx, sa restockMaterial function
  const restockMaterial = async (id, data) => {
    console.log("FETCHING URL:", `${BASE_URL}/materials/${id}/restock`);
    const res = await authFetch(`${BASE_URL}/materials/${id}/restock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // DAGDAG ITO:
    const responseData = await res.json().catch(() => ({}));
    console.log("RESTOCK RESPONSE:", res.ok, responseData);

    if (!res.ok) { throw new Error(responseData.message || 'Failed to restock'); }
    await fetchAll();
  };

  // ── Recipe actions ────
  const addRecipe = async (data) => {
    const res = await authFetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add recipe (Check backend schema)');
    }

    await fetchAll();
  };

  const updateRecipe = async (id, data) => {
    const res = await authFetch(`${BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to update recipe'); }
    await fetchAll();
  };
  const deleteRecipe = async (id) => {
    const res = await authFetch(`${BASE_URL}/recipes/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to delete recipe'); }
    await fetchAll();
  };

  // ── Batch production ────
  const confirmBatch = async (payload) => {
    const res = await authFetch(`${BASE_URL}/production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipe_id: payload.recipe_id,
        product_id: payload.product_id,
        product_name: payload.product_name,
        batches: payload.batches,
        total_produced: payload.total_produced,
        yield_unit: payload.yield_unit,
        notes: payload.notes || '',
      }),
    });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to confirm batch production'); }
    await fetchAll();
  };

  // ── Waste ────
  const logWaste = async (data) => {
    const res = await authFetch(`${BASE_URL}/waste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to log waste'); }
    await fetchAll(); // Refresh data from DB
  };

  const deleteWasteLog = async (id) => {
    const res = await authFetch(`${BASE_URL}/waste/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || 'Failed to delete waste log'); }
    await fetchAll(); // Refresh data from DB
  };

  const value = {
    products, orders, ingredients, materials, recipes, wasteLogs, productionLogs,
    loading, error,
    fetchAll, fetchOrders,
    addProduct, updateProduct, deleteProduct, uploadProductImage,
    addOrder, addOnlineOrder, updateOrderStatus,
    addIngredient, updateIngredient, deleteIngredient, restockIngredient,
    addMaterial, updateMaterial, deleteMaterial, restockMaterial,
    addRecipe, updateRecipe, deleteRecipe,
    confirmBatch,
    logWaste, deleteWasteLog,
    formatPHP
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};