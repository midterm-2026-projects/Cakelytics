import { TrendingUp } from 'lucide-react';

// DYNAMIC MOCK DATA BASE SA TIMEFRAME (Final Products na!)
const FORECAST_DATA = {
  '7d': {
    label: 'Next 7 Days',
    growth: [
      { name: 'Mocha Dedication Cake', pct: 12, diff: 5, forecast: 35 },
      { name: 'Chocolate Chiffon', pct: 8, diff: 3, forecast: 22 },
    ],
    risk: [
      { name: 'Strawberry Cupcakes', pct: -10, diff: -4, forecast: 18 },
      { name: 'Vanilla Roll', pct: -5, diff: -2, forecast: 15 },
    ]
  },
  '30d': {
    label: 'Next 30 Days',
    growth: [
      { name: 'Mocha Dedication Cake', pct: 15, diff: 12, forecast: 92 },
      { name: 'Chocolate Chiffon', pct: 10, diff: 8, forecast: 68 },
    ],
    risk: [
      { name: 'Strawberry Cupcakes', pct: -12, diff: -8, forecast: 58 },
      { name: 'Vanilla Roll', pct: -8, diff: -5, forecast: 57 },
    ]
  },
  '90d': {
    label: 'Next 90 Days',
    growth: [
      { name: 'Mocha Dedication Cake', pct: 25, diff: 45, forecast: 310 },
      { name: 'Custom Fondant Cakes', pct: 18, diff: 28, forecast: 165 },
    ],
    risk: [
      { name: 'Strawberry Cupcakes', pct: -18, diff: -25, forecast: 140 },
      { name: 'Assorted Brownies', pct: -15, diff: -20, forecast: 190 },
    ]
  }
};

export default function ProductForecasting({ view = '30d' }) {
  // Kunin ang tamang data base sa prop na ipinasa ni AnalyticsPage
  const currentData = FORECAST_DATA[view] || FORECAST_DATA['30d'];

  const renderMiniSparkline = (trend) => {
    const isUp = trend === 'up';
    const color = isUp ? '#10b981' : '#f43f5e';
    const path = isUp
      ? "M0,16 L10,12 L20,14 L30,6 L40,8 L50,2"
      : "M0,2 L10,8 L20,6 L30,14 L40,12 L50,16";

    return (
      <svg width="40" height="16" viewBox="0 0 50 20" className="overflow-visible hidden sm:block shrink-0">
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0,18 L50,18" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      </svg>
    );
  };

  return (
    <div className="w-full bg-white border border-brand-200 rounded-2xl shadow-sm flex flex-col p-4 sm:p-5 h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-1.5 bg-brand-50 rounded-lg text-brand-800 shrink-0">
          <TrendingUp size={18} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 flex-1">
          <h3 className="text-[12px] sm:text-[13px] font-black text-brand-800 uppercase tracking-widest leading-tight truncate">
            Product Trend Forecasting
          </h3>
          <span className="text-brand-800 font-bold bg-brand-100 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] w-fit shrink-0">
            {currentData.label}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 gap-5 sm:gap-4">
        {/* Growth Leaders */}
        <div className="flex flex-col flex-1">
          <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Lumalagong Products
          </h4>
          <div className="flex flex-col flex-1 gap-2">
            {currentData.growth.map((item, i) => (
              <div key={i} className="flex items-center justify-between flex-1 p-3 border border-emerald-100 bg-emerald-50/30 rounded-xl gap-3 min-h-[50px] transition-all hover:bg-emerald-50/60">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-brand-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+{item.diff} pcs</p>
                </div>
                {renderMiniSparkline('up')}
                <span className="shrink-0 px-2 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-extrabold rounded-md">
                  +{item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* At Risk Products */}
        <div className="flex flex-col flex-1">
          <h4 className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> At Risk Products
          </h4>
          <div className="flex flex-col flex-1 gap-2">
            {currentData.risk.map((item, i) => (
              <div key={i} className="flex items-center justify-between flex-1 p-3 border border-rose-100 bg-rose-50/30 rounded-xl gap-3 min-h-[50px] transition-all hover:bg-rose-50/60">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-brand-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{item.diff} pcs</p>
                </div>
                {renderMiniSparkline('down')}
                <span className="shrink-0 px-2 py-1 bg-rose-100 text-rose-800 text-[12px] font-extrabold rounded-md">
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}