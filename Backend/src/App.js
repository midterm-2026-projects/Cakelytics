const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes.js');
const ingredientRoutes = require('./routes/inventory/ingredient.routes.js');
const materialRoutes = require('./routes/inventory/material.routes.js');
const recipeRoutes = require('./routes/inventory/recipe.routes.js');
const productionRoutes = require('./routes/inventory/production.routes.js');
const wasteRoutes = require('./routes/inventory/waste.routes.js');

const { errorHandler } = require('./middleware/errorHandler.js');
const { authMiddlewareJwt } = require('./middleware/auth.middleware.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'CakeLytics backend is running' });
});

// ── Public ────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Protected (JWT required) ───────────────────────
app.use('/api/inventory/ingredients', authMiddlewareJwt, ingredientRoutes);
app.use('/api/inventory/materials', authMiddlewareJwt, materialRoutes);
app.use('/api/inventory/recipes', authMiddlewareJwt, recipeRoutes);
app.use('/api/inventory/production', authMiddlewareJwt, productionRoutes);
app.use('/api/inventory/waste', authMiddlewareJwt, wasteRoutes);

app.use(errorHandler);

module.exports = app;