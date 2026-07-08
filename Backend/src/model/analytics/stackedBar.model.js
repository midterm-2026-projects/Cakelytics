const { supabase } = require('../../config/supabase.js');
const { getDateRange } = require('../../../src/utils/analytics/PerformancetTimeframeHelper.utils.js');

const StackedBarModel = {
  // Kukunin ang orders (Sales) at raw_ingredients na na-record sa loob ng
  // timeframe (Expenses — cost_per_unit * stock_quantity). Ang pag-group
  // per day/hour/month (gaya ng makikita sa stackedBar.jsx) ay gagawin
  // sa service/frontend layer.
  getStackedBarByTimeframe: async (timeframe) => {
    const { startDate, endDate } = getDateRange(timeframe);

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('grand_total, status, created_at')
      .neq('status', 'Cancelled')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    const { data: ingredients, error: ingredientsError } = await supabase
      .from('raw_ingredients')
      .select('name, stock_quantity, cost_per_unit, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (ingredientsError) throw ingredientsError;

    return { orders, ingredients };
  },
};

module.exports = { StackedBarModel };