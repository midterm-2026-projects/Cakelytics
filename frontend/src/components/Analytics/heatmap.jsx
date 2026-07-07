import { useState } from 'react';
import { Activity } from 'lucide-react';
import HeatmapTimeframe from '../../components/Analytics/heatmapTimeframe';

// --- Cell style ---
function getCellStyle(value, maxValue) {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  const opacity = Math.min(0.1 + ratio * 0.82, 0.92);
  return {
    background: `rgba(92,51,23,${opacity.toFixed(2)})`,
    color: opacity < 0.45 ? '#5C3317' : '#fff',
  };
}

// --- Main component ---
export default function OrderVolumeHeatmap({
  days = ['Mon 10/16','Tue 10/17','Wed 10/18','Thu 10/19','Fri 10/20','Sat 10/21','Sun 10/22'],
  hours = ['6am','8am','10am','12pm','2pm','4pm','6pm','8pm'],
  data = [
    [3,6,4,5,4,10,11],[4,4,5,4,5,9,11],[6,6,6,6,4,10,10],
    [10,9,10,9,9,14,13],[10,10,9,8,9,13,14],[9,9,10,8,10,13,15],
    [5,6,5,5,6,8,9],[4,6,5,4,4,9,11],
  ],
  description = 'Shows the busiest hours for each day of the week. Darker means more orders.',
  title = 'Order Volume Heatmap',
}) {
  // Independent start-of-week logic para hindi na kailangan ng external dateUtils
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow));
    return d;
  });

  const isEmpty = !data || data.length === 0 || !days || days.length === 0;
  const maxValue = isEmpty ? 0 : Math.max(1, ...data.flat().filter((v) => typeof v === 'number'));

  return (
    <div className="w-full p-4 sm:p-5 bg-white border border-[#e7ded4] rounded-xl">
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Activity size={18} className="text-[#5C3317] shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#3d2410] truncate">{title}</h3>
            <p className="text-xs text-[#9a8b7a] mt-0.5">Peak hours by day of week</p>
          </div>
        </div>
        <HeatmapTimeframe weekStart={weekStart} onChange={setWeekStart} />
      </div>

      {isEmpty ? (
        <div role="status" className="flex items-center justify-center h-40 text-sm text-[#9a8b7a] border border-dashed border-[#e7ded4] rounded-lg">
          No order volume data available.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="min-w-[420px]">
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `36px repeat(${days.length}, 1fr)` }}>
              <div />
              {days.map((d) => {
                const [dayName, dateStr] = d.split(' ');
                return (
                  <div key={d} className="text-center text-[10px] sm:text-[11px] text-[#9a8b7a] font-semibold leading-tight">
                    <span>{dayName}</span>
                    {dateStr && <span className="block text-[8px] sm:text-[9px] font-normal mt-0.5">{dateStr}</span>}
                  </div>
                );
              })}
            </div>

            {hours.map((h, hi) => (
              <div key={h} className="grid gap-1 mb-1 items-center" style={{ gridTemplateColumns: `36px repeat(${days.length}, 1fr)` }}>
                <div className="text-right pr-1.5 text-[10px] sm:text-[11px] text-[#9a8b7a] font-semibold whitespace-nowrap">{h}</div>
                {days.map((d, di) => {
                  const value = data[hi]?.[di] ?? 0;
                  const style = getCellStyle(value, maxValue);
                  return (
                    <div
                      key={d}
                      title={`${d} ${h}: ${value} orders`}
                      className="rounded h-6 sm:h-7 flex items-center justify-center cursor-default transition-opacity hover:opacity-75"
                      style={{ background: style.background }}
                    >
                      <span className="text-[9px] sm:text-[10px] font-bold" style={{ color: style.color }}>{value}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#e7ded4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-[10px] mt-0.5 shrink-0">💡</span>
          <p className="text-[11px] text-[#9a8b7a] leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[#9a8b7a]">Low</span>
          <div className="flex gap-1">
            {[0.1, 0.3, 0.55, 0.75, 0.92].map((op) => (
              <div key={op} className="w-3 h-3 rounded-sm" style={{ background: `rgba(92,51,23,${op})` }} />
            ))}
          </div>
          <span className="text-[10px] text-[#9a8b7a]">High</span>
        </div>
      </div>
    </div>
  );
}