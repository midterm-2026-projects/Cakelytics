require('dotenv').config();
const app = require('./App');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("DEBUG: SUPABASE_URL ay:", process.env.SUPABASE_URL);
console.log("DEBUG: JWT_SECRET ay:", process.env.JWT_SECRET);



// sa vid ng sir, server ang kanya pero ang atin ay index