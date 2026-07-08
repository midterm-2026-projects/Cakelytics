const { supabase } = require('../../../src/config/supabase'); // I-adjust mo na lang ang path sa supabase config mo
const { getDateRange } = require('../../../src/utils/analytics/PerformancetTimeframeHelper.utils.js');

const getTopProductsByTimeframe = async (timeframe) => {
  const { startDate, endDate } = getDateRange(timeframe);

  // Gamit ang inner join para makuha lang ang order_items ng mga valid orders sa loob ng timeframe
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_name,
      quantity,
      orders!inner(created_at, status)
    `)
    .gte('orders.created_at', startDate)
    .lte('orders.created_at', endDate)
    .neq('orders.status', 'Cancelled');

  if (error) {
    console.error("Supabase Error sa Top Products:", error);
    throw new Error('Failed to fetch top products from database');
  }

  // I-aggregate ang benta (quantity) kada produkto
  const productMap = {};
  data.forEach((item) => {
    if (!productMap[item.product_name]) {
      productMap[item.product_name] = 0;
    }
    productMap[item.product_name] += item.quantity;
  });

  // I-convert pabalik sa array format na hinihingi ng UI at i-sort pababa
  const sortedProducts = Object.keys(productMap)
    .map(name => ({ name, sold: productMap[name] }))
    .sort((a, b) => b.sold - a.sold);

  return sortedProducts;
};

module.exports = { getTopProductsByTimeframe };