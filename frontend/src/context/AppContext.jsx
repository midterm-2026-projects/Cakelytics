// MOCK VERSION — habang naka-mock pa ang backend.
// Parehong shape ng value object sa totoong (DB-connected) version,
// para sa future swap, palitan na lang ang LOOB nito — hindi na
// kailangan galawin ang AppLayout.jsx o ibang components na gumagamit
// ng useApp().

import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── State (lahat walang-laman/default muna) ──────────────
  const [products,       setProducts]       = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [ingredients,    setIngredients]    = useState([]);
  const [materials,      setMaterials]      = useState([]);
  const [recipes,        setRecipes]        = useState([]);
  const [wasteLogs,      setWasteLogs]      = useState([]);
  const [productionLogs, setProductionLogs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── No-op loaders (papalitan ng totoong fetch sa future) ──
  const fetchAll    = async () => {};
  const fetchOrders = async () => {};

  // ── No-op actions (papalitan ng totoong service calls) ────
  const addProduct         = async () => {};
  const updateProduct      = async () => {};
  const deleteProduct      = async () => {};
  const uploadProductImage = async () => {};

  const addOrder         = async () => {};
  const addOnlineOrder   = async () => {};
  const updateOrderStatus = async () => {};

  const addIngredient    = async () => {};
  const updateIngredient = async () => {};
  const deleteIngredient = async () => {};

  const addMaterial    = async () => {};
  const updateMaterial = async () => {};
  const deleteMaterial = async () => {};

  const addRecipe    = async () => {};
  const updateRecipe = async () => {};
  const deleteRecipe = async () => {};

  const confirmBatch = async () => {};
  const logWaste      = async () => {};

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
    logWaste,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};