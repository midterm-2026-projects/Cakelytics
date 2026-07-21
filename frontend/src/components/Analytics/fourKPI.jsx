import { ShoppingBag, DollarSign, BarChart2, Percent } from 'lucide-react';

const fmtFull = (n) => '₱' + n.toLocaleString('en-PH');

const MOCK_KPI = {
  sales: 158000, sDelta: 6.2,
  expenses: 88500, eDelta: 2.1,
  profit: 69500, pDelta: 11.4,
  margin: 44.0, mDelta: 1.4,
};

const KPI_CONFIG = (kpi, period) => [
  {
    label: 'Total Sales',
    value: fmtFull(kpi.sales || kpi.totalSales || 0),
    delta: kpi.sDelta || 0,
    rawValue: kpi.sales || kpi.totalSales || 0,
    isCurrency: true,
    isGoodUp: true,
    accentColor: '#3b82f6',
    icon: <ShoppingBag size={15} color="#3b82f6" />,
  },
  {
    label: 'Total Expenses',
    value: fmtFull(kpi.expenses || kpi.totalExpenses || 0),
    delta: kpi.eDelta || 0,
    rawValue: kpi.expenses || kpi.totalExpenses || 0,
    isCurrency: true,
    isGoodUp: false,
    accentColor: '#f43f5e',
    icon: <DollarSign size={15} color="#f43f5e" />,
  },
  {
    label: 'Gross Profit',
    value: fmtFull(kpi.profit || kpi.grossProfit || 0),
    delta: kpi.pDelta || 0,
    rawValue: kpi.profit || kpi.grossProfit || 0,
    isCurrency: true,
    isGoodUp: true,
    accentColor: '#10b981',
    icon: <BarChart2 size={15} color="#10b981" />,
  },
  {
    label: 'Profit Margin',
    value: (kpi.margin || kpi.profitMargin || 0).toFixed(1) + '%',
    delta: kpi.mDelta || 0,
    rawValue: kpi.margin || kpi.profitMargin || 0,
    isCurrency: false,
    isGoodUp: true,
    accentColor: '#f59e0b',
    icon: <Percent size={15} color="#f59e0b" />,
  },
].map(card => ({ ...card, period }));

// 🔥 HELPER: Para mas may sense yung label ng comparison
const getComparisonLabel = (period) => {
  const p = (period || '').toLowerCase();
  if (p === 'today') return 'Yesterday';
  if (p === 'yesterday') return 'Previous Day';
  if (p.includes('week')) return 'Last Week';
  if (p.includes('month')) return 'Last Month';
  if (p.includes('year')) return 'Last Year';
  return 'Prior Period'; // Fallback
};

// ─── FourKpi ───────────────────────────────────────────────────
export default function FourKpi({ kpi, period = 'Week' }) {
  
  const currentKpi = kpi || MOCK_KPI;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {KPI_CONFIG(currentKpi, period).map(({ label, value, delta, rawValue, isCurrency, isGoodUp, accentColor, icon, period: p }) => {
        const isUp = delta >= 0;
        const isGood = isGoodUp ? isUp : !isUp;
        
        // --- FIX PARA SA DIVISION BY ZERO (NaN ERROR) ---
        const divisor = 1 + (delta / 100);
        const safeDivisor = divisor === 0 ? 1 : divisor; 
        
        const prior = (delta === 0 || divisor === 0) ? 0 : rawValue / safeDivisor;
        const diffAmt = Math.abs(rawValue - prior);
        // ------------------------------------------------
        
        const diffStr = delta === 0 
          ? '0.0%' 
          : (isCurrency ? fmtFull(Math.round(diffAmt)) : diffAmt.toFixed(1) + '%');

        // Gagamitin na natin yung helper function dito
        const displayPeriod = getComparisonLabel(p);

        return (
          <div key={label} className="bg-white border border-brand-300 rounded-xl overflow-hidden">
            <div className="h-1 w-full" style={{ background: accentColor }} />
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-400 truncate pr-2">{label}</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: accentColor + '18' }}>
                  {icon}
                </div>
              </div>
              <p className="text-[19px] sm:text-[24px] md:text-[28px] font-bold text-brand-900 leading-none tracking-tight mb-1.5 sm:mb-2 truncate" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </p>
              
              <p className={`text-[10px] sm:text-[12px] font-semibold flex items-center gap-1 ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
                <span>{isUp ? '▲' : '▼'}</span>
                <span className="truncate">{diffStr} vs {displayPeriod}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}