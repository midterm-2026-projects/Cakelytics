// ============================================================
// PerformancetTimeframeHelper.utils.js
// Tumutugma ito sa mga options ng performanceTimeframe.jsx
// Ginagamit ng FourKPI, StackedBar, at TopProducts model
// ============================================================

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const endOfDay = (d) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

const getDateRange = (period) => {
  const now = new Date();

  switch (period) {
    case 'Today':
      return { startDate: startOfDay(now).toISOString(), endDate: endOfDay(now).toISOString() };

    case 'Yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return { startDate: startOfDay(y).toISOString(), endDate: endOfDay(y).toISOString() };
    }

    case 'Last 7 Days': {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
    }

    // PINALITAN: Naging 'Last Month' na imbis na Last 30 Days
    case 'Last Month': {
      // Unang araw ng nakaraang buwan
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      // Huling araw ng nakaraang buwan (day 0 ng current month)
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(end).toISOString() };
    }

    case 'This Month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
    }

    case 'This Year': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
    }

    default: {
      // Custom range mula sa "YYYY-MM-DD - YYYY-MM-DD"
      if (period && period.includes(' - ')) {
        const [s, e] = period.split(' - ');
        return { startDate: startOfDay(new Date(s)).toISOString(), endDate: endOfDay(new Date(e)).toISOString() };
      }
      // Fallback
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
    }
  }
};

module.exports = { getDateRange };