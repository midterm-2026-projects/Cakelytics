// src/data/mockDatabase.js

// 1. Seed data na nakabase sa db.js schema mo
let ingredients = [
  { id: 'ing-1', name: 'All-purpose flour', unit: 'kg', stock: 25, min: 5, costPerUnit: 55.0 },
  { id: 'ing-2', name: 'White sugar', unit: 'kg', stock: 18, min: 4, costPerUnit: 60.0 },
  { id: 'ing-3', name: 'Butter', unit: 'kg', stock: 10, min: 2, costPerUnit: 320.0 },
];

let materials = [
  { id: 'mat-1', name: 'Tarpaulin 2x3ft', unit: 'pc', stock: 12, min: 3, costPerUnit: 150.0 },
  { id: 'mat-2', name: 'Balloon set (12pcs)', unit: 'set', stock: 8, min: 2, costPerUnit: 90.0 },
];

let recipes = [];
let productionLogs = [];
let wasteLogs = [];
let products = [
  { id: 'prod-1', name: 'Classic Vanilla Cake', stock: 5, price: 850 },
  { id: 'prod-2', name: 'Birthday Package A', stock: 2, price: 2500 }
];

const genId = () => 'mock-' + Math.random().toString(36).substr(2, 9);

// 2. Export ng mga CRUD at business logic simulation operations
export const mockDB = {
  getIngredients: () => [...ingredients],
  addIngredient: (data) => {
    const newIng = { id: genId(), ...data };
    ingredients.push(newIng);
    return newIng;
  },
  updateIngredient: (id, data) => {
    ingredients = ingredients.map(i => i.id === id ? { ...i, ...data } : i);
    return ingredients.find(i => i.id === id);
  },
  deleteIngredient: (id) => {
    ingredients = ingredients.filter(i => i.id !== id);
  },

  getMaterials: () => [...materials],
  addMaterial: (data) => {
    const newMat = { id: genId(), ...data };
    materials.push(newMat);
    return newMat;
  },
  updateMaterial: (id, data) => {
    materials = materials.map(m => m.id === id ? { ...m, ...data } : m);
    return materials.find(m => m.id === id);
  },
  deleteMaterial: (id) => {
    materials = materials.filter(m => m.id !== id);
  },

  getRecipes: () => [...recipes],
  addRecipe: (data) => {
    const newRecipe = { id: genId(), ...data };
    recipes.push(newRecipe);
    return newRecipe;
  },
  updateRecipe: (id, data) => {
    recipes = recipes.map(r => r.id === id ? { ...r, ...data } : r);
    return recipes.find(r => r.id === id);
  },
  deleteRecipe: (id) => {
    recipes = recipes.filter(r => r.id !== id);
  },

  getProductionLogs: () => [...productionLogs],
  confirmBatch: (recipeId, goalNum) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const batches = Math.ceil(goalNum / recipe.yield);
    
    // Auto deduct sa ingredients base sa batch formula
    recipe.ingredients.forEach(reqIng => {
      const dbIng = ingredients.find(i => i.name.toLowerCase() === reqIng.name.toLowerCase());
      if (dbIng) {
        dbIng.stock = +(dbIng.stock - (reqIng.qty * batches)).toFixed(4);
      }
    });

    // Paggawa ng bagong production log entry
    const newLog = {
      id: genId(),
      dt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      product: recipe.product,
      produced: goalNum,
      yieldUnit: recipe.yieldUnit
    };
    productionLogs.push(newLog);

    // Pagdagdag sa stock ng tapos na produkto
    const prod = products.find(p => p.name.toLowerCase() === recipe.product.toLowerCase());
    if (prod) prod.stock = (prod.stock || 0) + goalNum;

    return newLog;
  },

  getWasteLogs: () => [...wasteLogs],
  logWaste: (data) => {
    const { type, item, rawQty } = data;
    
    // Awtomatikong pagbawas sa stock kapag may nasirang raw ingredient o material
    if (type === 'ingredient') {
      const match = ingredients.find(i => i.name.toLowerCase() === item.toLowerCase());
      if (match) match.stock = +(match.stock - rawQty).toFixed(4);
    } else if (type === 'material') {
      const match = materials.find(m => m.name.toLowerCase() === item.toLowerCase());
      if (match) match.stock = +(match.stock - rawQty).toFixed(4);
    } else if (type === 'product') {
      const match = products.find(p => p.name.toLowerCase() === item.toLowerCase());
      if (match) match.stock = +(match.stock - rawQty).toFixed(4);
    }

    const newWaste = {
      id: genId(),
      dt: new Date().toISOString().split('T')[0],
      ...data
    };
    wasteLogs.push(newWaste);
    return newWaste;
  },
  deleteWasteLog: (id) => {
    wasteLogs = wasteLogs.filter(w => w.id !== id);
  },

  getProducts: () => [...products],
  updateProduct: (id, data) => {
    products = products.map(p => p.id === id ? { ...p, ...data } : p);
    return products.find(p => p.id === id);
  }
};