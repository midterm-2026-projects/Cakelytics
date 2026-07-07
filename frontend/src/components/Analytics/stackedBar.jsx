import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LucideLineChart } from 'lucide-react';

export default function StackedBar({ period = 'Last 7 Days', height = 240, data: propData }) {
  
  // DYNAMIC CHART GENERATOR
  const chartData = useMemo(() => {
    // Kung may ipinasang totoong data (mula sa test o backend), yun ang gamitin
    if (propData) return propData.map(d => ({ ...d, Profit: d.Sales - d.Expenses }));

    const data = [];
    const today = new Date();

    if (period === 'Today' || period === 'Yesterday' || period.includes(' - ')) {
      // 6 AM to 8 PM (every 2 hours)
      const hours = [6, 8, 10, 12, 14, 16, 18, 20];
      hours.forEach(h => {
        const label = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
        data.push({
          label,
          // eslint-disable-next-line react-hooks/purity
          Sales: 2000 + Math.random() * 3000,
          // eslint-disable-next-line react-hooks/purity
          Expenses: 1000 + Math.random() * 1500,
        });
      });
    } else if (period === 'Last 7 Days') {
      // Last 7 days pamula ngayon
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateNum = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data.push({
          label: `${dayName} (${dateNum})`,
          // eslint-disable-next-line react-hooks/purity
          Sales: 15000 + Math.random() * 15000,
          // eslint-disable-next-line react-hooks/purity
          Expenses: 8000 + Math.random() * 6000,
        });
      }
    } else if (period === 'This Year') {
      // Months of the year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(m => {
        data.push({
          label: m,
          // eslint-disable-next-line react-hooks/purity
          Sales: 400000 + Math.random() * 200000,
          // eslint-disable-next-line react-hooks/purity
          Expenses: 200000 + Math.random() * 100000,
        });
      });
    } else {
      // For Last 30 Days or This Month -> 30 days of values
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        data.push({
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          // eslint-disable-next-line react-hooks/purity
          Sales: 15000 + Math.random() * 8000,
          // eslint-disable-next-line react-hooks/purity
          Expenses: 8000 + Math.random() * 4000,
        });
      }
    }

    return data.map(d => ({ ...d, Profit: d.Sales - d.Expenses }));
  }, [period, propData]);

  const fmtFull = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
  const fmtAxis = (v) => {
    if (v >= 1000000) return '₱' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return '₱' + (v / 1000).toFixed(0) + 'K';
    return '₱' + v;
  };

  const axisStyle = { fontSize: 12, fill: '#64748b', fontWeight: 600 };

  return (
    <div className="p-4 sm:p-5 bg-white border border-brand-100 rounded-xl" data-testid="performance-trend">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideLineChart size={18} className="text-brand-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-brand-800">Performance Trend</h3>
            <p className="text-xs text-brand-400 mt-0.5">Sales composition · {period}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-500 font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />Total Sales</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]" />Expenses</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />Profit</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height} minWidth={0}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="24%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} dy={10} minTickGap={20} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtAxis} width={56} />
          
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const dataObj = payload[0].payload; 
              return (
                <div className="bg-white border border-brand-200 rounded-md shadow-lg p-3 text-sm min-w-[150px]">
                  <p className="font-semibold text-brand-800 mb-2">{label}</p>
                  <p className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full inline-block bg-[#3b82f6]" /><span className="text-brand-500">Total Sales:</span></span>
                    <span className="font-bold text-blue-600">{fmtFull(dataObj.Sales)}</span>
                  </p>
                  {payload.map((p, i) => (
                    <p key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color || p.fill }} /><span className="text-brand-500">{p.name}:</span></span>
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
    </div>
  );
}