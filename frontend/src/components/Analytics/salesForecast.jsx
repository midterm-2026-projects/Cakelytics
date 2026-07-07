import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart2 } from 'lucide-react';

// 1. ILABAS ANG HELPERS AT TOOLTIP DITO SA TAAS
const formatCurrency = (val) => `₱${Number(val).toLocaleString('en-PH')}`;
const formatAxis = (val) => (val >= 1000 ? `₱${(val / 1000).toFixed(0)}K` : `₱${val}`);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-200 rounded-md shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-2">{label}</p>
      <div className="flex flex-col gap-2">
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <span className="flex items-center gap-2 text-stone-500 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              {p.name}:
            </span>
            <span className="font-bold text-stone-800">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. TANGGAPIN ANG `data` AS PROP PARA PUMASA SA TEST
export default function SalesForecast({ title = 'Sales Forecast', view = '30d', data: propData }) {
  
  const chartData = useMemo(() => {
    // Kung may ipinasang data yung test o parent, yun ang gamitin natin
    if (propData) return propData;

    // Kung wala, tsaka lang natin i-generate yung mock data
    const daysMap = { '7d': 7, '30d': 30, '60d': 60 }; 
    const totalPoints = daysMap[view] || 30;
    const ACTUAL_RATIO = 0.30; 
    const pastDays = Math.round(totalPoints * ACTUAL_RATIO);
    const today = new Date();

    return Array.from({ length: totalPoints }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - pastDays + i); 
      
      const isFuture = i > pastDays;
      const isToday = i === pastDays;
      
      // eslint-disable-next-line react-hooks/purity
      const baseValue = 15000 + (Math.random() * 4000) + (i * (3000 / totalPoints)); 

      return {
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday,
        actualSales: !isFuture ? Math.round(baseValue) : null,
        // eslint-disable-next-line react-hooks/purity
        forecastSales: isFuture || isToday ? Math.round(baseValue + (Math.random() * 1500)) : null,
      };
    });
  }, [view, propData]);

  const periodText = view === '7d' ? '7-Day' : view === '60d' ? '60-Day' : '30-Day';

  return (
    <div className="w-full p-5 bg-white border border-[#e7ded4] rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-[#5C3317]" />
        <div>
          <h3 className="text-base font-bold text-[#3d2410]">{title}</h3>
          <p className="text-xs text-[#9a8b7a]">{periodText} Trend Analysis</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1ece4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9a8b7a', fontWeight: 500 }} axisLine={{ stroke: '#f1ece4' }} tickLine={false} dy={10} minTickGap={30} />
            <YAxis tick={{ fontSize: 12, fill: '#9a8b7a', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={formatAxis} />
            
            <ReferenceLine x={chartData.find(d => d.isToday)?.label} stroke="#d6c5b3" strokeDasharray="4 4" label={{ position: 'top', value: 'Ngayon', fill: '#9a8b7a', fontSize: 11, fontWeight: 'bold' }} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1ece4', strokeWidth: 2 }} />
            
            <Line type="monotone" dataKey="forecastSales" name="Forecast" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="actualSales" name="Actual" stroke="#5C3317" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#e7ded4] text-xs">
        <span className="flex items-center gap-2 text-[#5C3317] font-semibold"><span className="w-4 h-0.5 bg-[#5C3317] rounded" /> Actual Sales</span>
        <span className="flex items-center gap-2 text-[#9a8b7a]"><span className="w-4 border-t-2 border-dashed border-[#d97706]" /> Forecasted Sales</span>
      </div>
    </div>
  );
}