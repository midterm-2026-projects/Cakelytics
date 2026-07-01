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
    value: fmtFull(kpi.sales),
    delta: kpi.sDelta,
    rawValue: kpi.sales,
    isCurrency: true,
    isGoodUp: true,
    accentColor: '#3b82f6',
    icon: <ShoppingBag size={15} color="#3b82f6" />,
  },
  {
    label: 'Total Expenses',
    value: fmtFull(kpi.expenses),
    delta: kpi.eDelta,
    rawValue: kpi.expenses,
    isCurrency: true,
    isGoodUp: false,
    accentColor: '#f43f5e',
    icon: <DollarSign size={15} color="#f43f5e" />,
  },
  {
    label: 'Gross Profit',
    value: fmtFull(kpi.profit),
    delta: kpi.pDelta,
    rawValue: kpi.profit,
    isCurrency: true,
    isGoodUp: true,
    accentColor: '#10b981',
    icon: <BarChart2 size={15} color="#10b981" />,
  },
  {
    label: 'Profit Margin',
    value: kpi.margin.toFixed(1) + '%',
    delta: kpi.mDelta,
    rawValue: kpi.margin,
    isCurrency: false,
    isGoodUp: true,
    accentColor: '#f59e0b',
    icon: <Percent size={15} color="#f59e0b" />,
  },
].map(card => ({ ...card, period }));

// ─── FourKpi ───────────────────────────────────────────────────
export default function FourKpi({ kpi = MOCK_KPI, period = 'Week' }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {KPI_CONFIG(kpi, period).map(({ label, value, delta, rawValue, isCurrency, isGoodUp, accentColor, icon, period: p }) => {
        const isUp = delta >= 0;
        const isGood = isGoodUp ? isUp : !isUp;
        const prior = rawValue / (1 + (delta / 100));
        const diffAmt = Math.abs(rawValue - prior);
        const diffStr = isCurrency ? fmtFull(Math.round(diffAmt)) : diffAmt.toFixed(1) + '%';

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
                <span className="truncate">{diffStr} vs prior {p}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}