require('dotenv').config();
const app = require('./App');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// sa vid ng sir, server ang kanya pero ang atin ay index