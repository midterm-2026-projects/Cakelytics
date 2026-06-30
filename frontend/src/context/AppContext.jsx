// src/context/AppContext.jsx

// MOCK VERSION — habang naka-mock pa ang backend.
// Parehong shape ng value object sa totoong (DB-connected) version,
// para sa future swap, palitan na lang ang LOOB nito — hindi na
// kailangan galawin ang AppLayout.jsx o ibang components na gumagamit
// ng useApp().

import { createContext, useContext, useState } from 'react';
import { mockDB } from '../data/mockDatabase'; // I-import ang localized in-memory database file

const AppContext = createContext(null);
const BASE_URL = 'http://localhost:4000/inventory'; // /inventory na ang unahan ng controllers

export function AppProvider({ children }) {
  // ── State (Lazy initialization para maiwasan ang ESLint cascading render warning) ──
  const [ingredients,    setIngredients]    = useState(() => mockDB.getIngredients());
  const [materials,      setMaterials]      = useState(() => mockDB.getMaterials());
  const [recipes,        setRecipes]        = useState(() => mockDB.getRecipes());
  const [productionLogs, setProductionLogs] = useState(() => mockDB.getProductionLogs());
  const [wasteLogs,      setWasteLogs]      = useState(() => mockDB.getWasteLogs());
  const [products,       setProducts]       = useState(() => mockDB.getProducts());
  const [orders,         setOrders]         = useState([]);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Helper Function para i-synchronize ang UI State sa tuwing may magbabago sa Mock DB ──
  const refreshState = () => {
    setIngredients(mockDB.getIngredients());
    setMaterials(mockDB.getMaterials());
    setRecipes(mockDB.getRecipes());
    setProductionLogs(mockDB.getProductionLogs());
    setWasteLogs(mockDB.getWasteLogs());
    setProducts(mockDB.getProducts());
  };

  // ── Network Fetch Loaders ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ing, mat, rec, prodLog, wst, prd] = await Promise.all([
        fetch(`${BASE_URL}/ingredients`).then(r => r.json()),
        fetch(`${BASE_URL}/materials`).then(r => r.json()),
        fetch(`${BASE_URL}/recipes`).then(r => r.json()),
        fetch(`${BASE_URL}/production-logs`).then(r => r.json()),
        fetch(`${BASE_URL}/waste`).then(r => r.json()),
        fetch(`${BASE_URL}/products`).then(r => r.json())
      ]);

      setIngredients(ing.data || []);
      setMaterials(mat.data || []);
      setRecipes(rec.data || []);
      setProductionLogs(prodLog.data || []);
      setWasteLogs(wst.data || []);
      setProducts(prd.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {};

  // ── Product actions ────
  const addProduct         = async () => {};
  const updateProduct      = async (id, data) => { mockDB.updateProduct(id, data); refreshState(); };
  const deleteProduct      = async () => {};
  const uploadProductImage = async () => {};

  // ── Order actions ────
  const addOrder         = async () => {};
  const addOnlineOrder   = async () => {};
  const updateOrderStatus = async () => {};

  // ── Ingredient actions ────
  const addIngredient = async (data) => {
    await fetch(`${BASE_URL}/ingredients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const updateIngredient = async (id, data) => {
    await fetch(`${BASE_URL}/ingredients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const deleteIngredient = async (id) => {
    await fetch(`${BASE_URL}/ingredients/${id}`, { method: 'DELETE' });
    refreshState();
  };

  // ── Material actions ────
  const addMaterial = async (data) => {
    await fetch(`${BASE_URL}/materials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const updateMaterial = async (id, data) => {
    await fetch(`${BASE_URL}/materials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const deleteMaterial = async (id) => {
    await fetch(`${BASE_URL}/materials/${id}`, { method: 'DELETE' });
    refreshState();
  };

  // ── Recipe actions ────
  const addRecipe = async (data) => {
    await fetch(`${BASE_URL}/recipes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const updateRecipe = async (id, data) => {
    await fetch(`${BASE_URL}/recipes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  const deleteRecipe = async (id) => {
    await fetch(`${BASE_URL}/recipes/${id}`, { method: 'DELETE' });
    refreshState();
  };

  // ── Batch production ────
  const confirmBatch = async (recipeId, goalNum) => {
    await fetch(`${BASE_URL}/recipes/${recipeId}/confirm-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goalNum }) });
    refreshState();
  };

  // ── Waste ────
  const logWaste = async (data) => {
    await fetch(`${BASE_URL}/waste`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    refreshState();
  };
  
  const deleteWasteLog = async (id) => {
    await fetch(`${BASE_URL}/waste/${id}`, { method: 'DELETE' });
    refreshState();
  };

  const value = {
    // ── Data
    products, orders, ingredients, materials, recipes, wasteLogs, productionLogs,
    // ── Status
    loading, error,
    // ── Loaders
    fetchAll, fetchOrders,
    // ── Product actions
    addProduct, updateProduct, deleteProduct, uploadProductImage,
    // ── Order actions
    addOrder, addOnlineOrder, updateOrderStatus,
    // ── Ingredient actions
    addIngredient, updateIngredient, deleteIngredient,
    // ── Material actions
    addMaterial, updateMaterial, deleteMaterial,
    // ── Recipe actions
    addRecipe, updateRecipe, deleteRecipe,
    // ── Batch production
    confirmBatch,
    // ── Waste
    logWaste, deleteWasteLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};