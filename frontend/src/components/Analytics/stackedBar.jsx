import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LineChart as LucideLineChart } from 'lucide-react';

export default function StackedBar({
  data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sales: [22000, 24500, 14000, 27000, 30500, 36000, 19500],
    expenses: [13500, 15000, 8500, 16500, 18500, 19000, 12000],
  },
  period = 'Week',
  height = 240,
}) {
  // 1. Data Preparation
  const chartData = data.labels.map((label, i) => {
    const Sales = data.sales[i] ?? 0;
    const Expenses = data.expenses[i] ?? 0;
    return {
      label,
      Sales,
      Expenses,
      Profit: Sales - Expenses,
    };
  });

  const fmtFull = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
  const fmtAxis = (v) => {
    if (v >= 1000000) return '₱' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return '₱' + (v / 1000).toFixed(0) + 'K';
    return '₱' + v;
  };

  const axisStyle = { fontSize: 13, fill: '#64748b', fontWeight: 600 };

  return (
    <div
      className="p-4 sm:p-5 bg-white border border-brand-100 rounded-xl"
      data-testid="performance-trend"
    >
      {/* Header & Inline Legend */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideLineChart size={18} className="text-brand-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-brand-800">
              Performance Trend
            </h3>
            <p className="text-xs text-brand-400 mt-0.5">
              Sales composition · {period}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-500 font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />Total Sales</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]" />Expenses</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />Profit</span>
        </div>
      </div>

      {/* Chart Area */}
      <ResponsiveContainer width="100%" height={height} minWidth={0}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="24%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} dy={10} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtAxis} width={56} />
          
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const dataObj = payload[0].payload; // Kunin ang buong data ng araw na iyon
              
              return (
                <div className="bg-white border border-brand-200 rounded-md shadow-lg p-3 text-sm min-w-[150px]">
                  <p className="font-semibold text-brand-800 mb-2">{label}</p>
                  
                  <p className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block bg-[#3b82f6]" />
                      <span className="text-brand-500">Total Sales:</span>
                    </span>
                    <span className="font-bold text-blue-600">{fmtFull(dataObj.Sales)}</span>
                  </p>

                  {payload.map((p, i) => (
                    <p key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color || p.fill }} />
                        <span className="text-brand-500">{p.name}:</span>
                      </span>
                      <span className="font-bold text-brand-800">{fmtFull(p.value)}</span>
                    </p>
                  ))}
                </div>
              );
            }}
          />

          <Bar dataKey="Expenses" name="Expenses" fill="#f43f5e" stackId="a" />
          <Bar dataKey="Profit" name="Profit" fill="#10b981" stackId="a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 pt-3 border-t border-brand-100 flex items-start gap-2">
        <span className="text-[10px] mt-0.5" aria-hidden="true">💡</span>
        <p className="text-[11px] text-brand-400 leading-relaxed">
          Ang buong taas ng bar ay kumakatawan sa kabuuang <span className="font-semibold text-blue-600">Sales</span>. 
          Pinapakita nito kung magkano doon ang napunta sa <span className="font-semibold text-rose-500">Expenses</span> (pula) at 
          magkano ang naiuwing <span className="font-semibold text-emerald-600">Profit</span> (berde).
        </p>
      </div>
    </div>
  );
}