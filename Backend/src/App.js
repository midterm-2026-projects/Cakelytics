const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes.js'); 

const inventoryRoutes = require('./routes/inventory.routes.js'); 

const analyticsRoutes = require('./routes/analytics.routes.js'); 

const { errorHandler } = require('./middleware/errorHandler.js'); 
const { authMiddlewareJwt } = require('./middleware/auth.middleware.js'); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

// Ilagay ito pagkatapos ng app declaration at BAGO ang mga API routes
app.use((req, res, next) => { 
  const timestamp = new Date().toISOString();
<<<<<<< HEAD
  console.log(` ${req.method} ${req.url}`); 
=======
  console.log(`[${timestamp}] ${req.method} ${req.url}`); 
>>>>>>> 1dd91630da677df9dbc9041a53e97fbdcab036c2
  
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


// ── Protected (JWT required)

<<<<<<< HEAD
// example dapat ganito lahat ng endpoints niyo dito
// app.use('/api/inventory',authMiddlewareJwt, inventoryRoutes); 


// Isang tawag na lang ngayon para sa lahat ng endpoints

app.use('/api/inventory',authMiddlewareJwt, inventoryRoutes); 

app.use('/api/analytics',authMiddlewareJwt, analyticsRoutes); 
=======
// Isang tawag na lang ngayon para sa lahat ng inventory endpoints
app.use('/api/inventory', inventoryRoutes); 

app.use('/api/analytics', analyticsRoutes); 
>>>>>>> 1dd91630da677df9dbc9041a53e97fbdcab036c2

app.use(errorHandler);

module.exports = app; 