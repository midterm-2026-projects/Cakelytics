// Ginagamit ng heatmap.model.js. Tumatanggap ng weekStart (Date o ISO string)
// mula sa heatmapTimeframe.jsx at ibinabalik ang buong 7-day na range.

const getWeekRange = (weekStart) => {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

module.exports = { getWeekRange };