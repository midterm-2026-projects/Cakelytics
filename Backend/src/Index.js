require('dotenv').config();
const app = require('./App');
// const { setupAnalyticsCron } = require('./cron/analytics.cron'); // I-import

const PORT = process.env.PORT || 4000;

// I-initialize ang Cron Job
// setupAnalyticsCron();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});