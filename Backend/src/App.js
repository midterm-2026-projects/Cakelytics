const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes.js'); 

const inventoryRoutes = require('./routes/inventory.routes.js'); 

const analyticsRoutes = require('./routes/analytics.routes.js'); 

const { errorHandler } = require('./middleware/errorHandler.js'); 
const { authMiddlewareJwt } = require('./middleware/auth.middleware.js'); 

const customerRoutes = require('./routes/customer.routes.js');
const orderRoutes = require('./routes/order.routes.js'); 
const productRoutes = require('./routes/product.routes.js');

const app = express(); 

app.use(cors()); 
//app.use(express.json()); 
app.use(express.json({ limit: '25mb' }));

// Ilagay ito pagkatapos ng app declaration at BAGO ang mga API routes
app.use((req, res, next) => { 
  const timestamp = new Date().toISOString();
  console.log(` ${req.method} ${req.url}`); 
  
  // O kung gusto mong makita pati ang body (halimbawa: login credentials)
  if (req.method === 'POST' || req.method === 'PATCH') { 
    console.log('Body:', JSON.stringify(req.body)); 
  }
  
  next(); // Importante: Huwag kalimutan ito para magpatuloy ang request 
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => { 
  res.json({ status: 'CakeLytics backend is running' }); 
});

app.use('/api', authRoutes);  
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders/checkout', orderRoutes);
app.use('/api/products', productRoutes);


// ── Protected (JWT required)

// example dapat ganito lahat ng endpoints niyo dito depende kung alin ang dapat protected at alin ang public.

// app.use('/api/inventory',authMiddlewareJwt, inventoryRoutes); 


// Isang tawag na lang ngayon para sa lahat ng endpoints

app.use('/api/inventory',authMiddlewareJwt, inventoryRoutes); 

app.use('/api/analytics',authMiddlewareJwt, analyticsRoutes); 

app.use(errorHandler);

module.exports = app; 