const { supabase } = require('../../../src/config/supabase'); // I-adjust mo na lang ang path
const { getWeekRange } = require('../../../src/utils/analytics/HeatmapTimeframeHelper.utils');

const getOrderVolumeByTimeframe = async (weekStart) => {
  const { startDate, endDate } = getWeekRange(weekStart);

  const { data, error } = await supabase
    .from('orders')
    .select('created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .neq('status', 'Cancelled');

  if (error) {
    console.error("Supabase Error sa Heatmap:", error);
    throw new Error('Failed to fetch heatmap data from database');
  }

  // Gumawa ng 8x7 blank matrix (8 time slots x 7 days) na puro 0
  const heatmapData = Array.from({ length: 8 }, () => Array(7).fill(0));

  data.forEach((order) => {
    const date = new Date(order.created_at);
    
    // Day Index Logic: Frontend expects Mon=0, Tue=1 ... Sun=6
    // JS getDay() returns Sun=0, Mon=1 ... Sat=6
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; // Gawing 6 ang Sunday

    // Hour Index Logic: 6am=0, 8am=1, 10am=2, 12pm=3, 2pm=4, 4pm=5, 6pm=6, 8pm=7
    const hour = date.getHours();
    
    // Kunin lang ang orders na pumasok sa pagitan ng 6 AM at 9:59 PM
    if (hour >= 6 && hour < 22) {
      const hourIndex = Math.floor((hour - 6) / 2); // Naghahati kada 2 oras
      if (hourIndex >= 0 && hourIndex <= 7) {
        heatmapData[hourIndex][dayIndex] += 1; // Mag-dagdag ng 1 order volume
      }
    }
  });

  return heatmapData;
};

module.exports = { getOrderVolumeByTimeframe };