const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes.js');
const ingredientRoutes = require('./routes/inventory/ingredient.routes.js');
const materialRoutes = require('./routes/inventory/material.routes.js');
const productRoutes = require('./routes/inventory/product.routes.js');
const recipeRoutes = require('./routes/inventory/recipe.routes.js');
const productionRoutes = require('./routes/inventory/production.routes.js');
const wasteRoutes = require('./routes/inventory/waste.routes.js');

const { errorHandler } = require('./middleware/errorHandler.js');
const { authMiddlewareJwt } = require('./middleware/auth.middleware.js');

const app = express();

app.use(cors());
app.use(express.json());

// Ilagay ito pagkatapos ng app declaration at BAGO ang mga API routes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // O kung gusto mong makita pati ang body (halimbawa: login credentials)
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('Body:', JSON.stringify(req.body));
  }
  
  next(); // Importante: Huwag kalimutan ito para magpatuloy ang request
});

app.get('/', (req, res) => {
  res.json({ status: 'CakeLytics backend is running' });
});

app.use('/api', authRoutes);


// ── Protected (JWT required) ───────────────────────
app.use('/api/inventory/ingredients', ingredientRoutes);
app.use('/api/inventory/materials', materialRoutes);
app.use('/api/inventory/products', productRoutes);
app.use('/api/inventory/recipes', recipeRoutes);
app.use('/api/inventory/production', productionRoutes);
app.use('/api/inventory/waste', wasteRoutes);

app.use(errorHandler);

module.exports = app;