import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart2 } from 'lucide-react';

const formatCurrency = (val) => `₱${Number(val).toLocaleString('en-PH')}`;
const formatAxis = (val) => (val >= 1000 ? `₱${(val / 1000).toFixed(0)}K` : `₱${val}`);

// Tinatanggap na ngayon ng tooltip ang 'todayLabel' para alam niya kung kailan itatago ang 'Actual'
const CustomTooltip = ({ active, payload, label, todayLabel }) => {
  if (!active || !payload?.length) return null;

  // Kung ang label na naka-hover ay ang "Today", i-filter out ang "Actual" sa display
  const displayPayload = label === todayLabel 
    ? payload.filter(p => p.dataKey !== 'actualSales')
    : payload;

  return (
    <div className="bg-white border border-stone-200 rounded-md shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-2">{label}</p>
      <div className="flex flex-col gap-2">
        {displayPayload.map((p, i) => (
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

export default function SalesForecast({ title = 'Sales Forecast', view = '30d', data: propData }) {

  const hasFetchedButEmpty = Array.isArray(propData) && propData.length === 0;

  const chartData = useMemo(() => {
    if (Array.isArray(propData) && propData.length > 0) return propData;
    if (hasFetchedButEmpty) return [];

    const daysMap = { '7d': 7, '30d': 30, '60d': 60 };
    const totalPoints = daysMap[view] || 30;

    return Array.from({ length: totalPoints }, (_, i) => ({
      label: `Day ${i + 1}`,
      actualSales: i < 15 ? 10000 + Math.random() * 5000 : null,
      forecastSales: i >= 15 ? 12000 + Math.random() * 5000 : null,
      isToday: i === 15
    }));
  }, [view, propData, hasFetchedButEmpty]);

  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const bridgedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    
    // Hanapin muna gamit ang exact Date string bago mag-rely sa isToday flag ng API
    let idx = chartData.findIndex((d) => d.label === formattedToday);
    
    // Fallback
    if (idx === -1) {
       idx = chartData.findIndex(d => d.isToday);
    }

    if (idx === -1) return chartData;

    const bridged = chartData.slice();
    
    // Siguraduhing walang naiwang duplicate isToday flags sa past days
    bridged.forEach(d => d.isToday = false);
    
    const point = { ...bridged[idx], isToday: true, label: formattedToday };

    // Binalik natin ito para MAGKADUGTONG pa rin ang solid at dashed line sa mismong graph
    if (point.actualSales != null && point.forecastSales == null) {
      point.forecastSales = point.actualSales;
    } else if (point.forecastSales != null && point.actualSales == null) {
      point.actualSales = point.forecastSales;
    }

    bridged[idx] = point;
    return bridged;
  }, [chartData, formattedToday]);

  const todayLabel = bridgedData.find(d => d.label === formattedToday || d.isToday)?.label;
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

      {hasFetchedButEmpty ? (
        <div role="status" className="flex items-center justify-center h-[280px] text-sm text-[#9a8b7a] border border-dashed border-[#e7ded4] rounded-lg text-center px-6">
          No forecast data available. It updates once a day.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bridgedData} margin={{ top: 25, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1ece4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9a8b7a', fontWeight: 500 }} axisLine={{ stroke: '#f1ece4' }} tickLine={false} dy={10} minTickGap={30} />
              <YAxis tick={{ fontSize: 12, fill: '#9a8b7a', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={formatAxis} />

              {todayLabel && <ReferenceLine x={todayLabel} stroke="#d6c5b3" strokeDasharray="4 4" label={{ position: 'top', value: 'Today', fill: '#9a8b7a', fontSize: 11, fontWeight: 'bold' }} />}

              {/* Ipinasa natin ang todayLabel sa Tooltip para alam niya ang ififilter */}
              <Tooltip content={<CustomTooltip todayLabel={todayLabel} />} cursor={{ stroke: '#f1ece4', strokeWidth: 2 }} />

              <Line type="monotone" dataKey="forecastSales" name="Forecast" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 5 }} connectNulls />
              <Line type="monotone" dataKey="actualSales" name="Actual" stroke="#5C3317" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#e7ded4] text-xs">
        <span className="flex items-center gap-2 text-[#5C3317] font-semibold"><span className="w-4 h-0.5 bg-[#5C3317] rounded" /> Actual Sales</span>
        <span className="flex items-center gap-2 text-[#9a8b7a]"><span className="w-4 border-t-2 border-dashed border-[#d97706]" /> Forecasted Sales</span>
      </div>
    </div>
  );
}