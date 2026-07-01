import { useState, useRef, useEffect } from 'react';
import { Activity, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LETTERS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

// --- Function 1: Date utilities ---
function dateUtils(action, ...args) {
  switch (action) {
    case 'startOfWeek': {
      const d = new Date(args[0]);
      d.setHours(0, 0, 0, 0);
      const dow = d.getDay();
      d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow));
      return d;
    }
    case 'addDays': {
      const d = new Date(args[0]);
      d.setDate(d.getDate() + args[1]);
      return d;
    }
    case 'isSameDay': {
      const [a, b] = args;
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    case 'isSameMonth': {
      const [a, b] = args;
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    }
    case 'weekLabel': {
      const weekStart = args[0];
      const weekEnd = dateUtils('addDays', weekStart, 6);
      const sM = MONTH_NAMES[weekStart.getMonth()];
      const eM = MONTH_NAMES[weekEnd.getMonth()];
      const sY = weekStart.getFullYear();
      const eY = weekEnd.getFullYear();
      if (sY !== eY) return `${sM} ${weekStart.getDate()}, ${sY} - ${eM} ${weekEnd.getDate()}, ${eY}`;
      if (sM === eM) return `${sM} ${weekStart.getDate()}-${weekEnd.getDate()}, ${sY}`;
      return `${sM} ${weekStart.getDate()} - ${eM} ${weekEnd.getDate()}, ${sY}`;
    }
    case 'monthGrid': {
      const monthDate = args[0];
      const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const gridStart = dateUtils('startOfWeek', first);
      return Array.from({ length: 42 }, (_, i) => dateUtils('addDays', gridStart, i));
    }
    default:
      return null;
  }
}

// --- Function 2: Cell style ---
function getCellStyle(value, maxValue) {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  const opacity = Math.min(0.1 + ratio * 0.82, 0.92);
  return {
    background: `rgba(92,51,23,${opacity.toFixed(2)})`,
    color: opacity < 0.45 ? '#5C3317' : '#fff',
  };
}

// --- WeekRangePicker ---
function WeekRangePicker({ weekStart, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date(weekStart.getFullYear(), weekStart.getMonth(), 1));
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const weekEnd = dateUtils('addDays', weekStart, 6);
  const grid = dateUtils('monthGrid', viewMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          if (!open) {
            setViewMonth(new Date(weekStart.getFullYear(), weekStart.getMonth(), 1));
          }
          setOpen(!open);
        }}
        className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium border border-[#e7ded4] rounded-md px-2 py-1.5 text-[#3d2410] outline-none focus:border-[#5C3317] bg-[#f9f6f1] hover:border-[#d8cab8] transition-colors whitespace-nowrap"
        aria-label="Select week"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span aria-hidden="true">
          {dateUtils('weekLabel', weekStart)}
        </span>
        <Calendar
          size={13}
          className="text-[#9a8b7a] shrink-0"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div role="dialog" aria-label="Select week" className="absolute right-0 mt-1.5 z-20 w-[280px] bg-white border border-[#e7ded4] rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} className="p-1 rounded hover:bg-[#f9f6f1] text-[#5C3317]" aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-bold text-[#3d2410]">{MONTH_FULL[viewMonth.getMonth()]} {viewMonth.getFullYear()}</span>
            <button type="button" onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} className="p-1 rounded hover:bg-[#f9f6f1] text-[#5C3317]" aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAY_LETTERS.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-[#9a8b7a] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {grid.map((day) => {
              const inSelectedWeek = day >= weekStart && day <= weekEnd;
              const inCurrentMonth = dateUtils('isSameMonth', day, viewMonth);
              const isToday = dateUtils('isSameDay', day, today);
              const isWeekStart = dateUtils('isSameDay', day, weekStart);
              const isWeekEnd = dateUtils('isSameDay', day, weekEnd);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => { onChange(dateUtils('startOfWeek', day)); setOpen(false); }}
                  className={[
                    'text-[11px] h-7 flex items-center justify-center transition-colors',
                    inSelectedWeek ? 'bg-[#5C3317]' : 'hover:bg-[#f9f6f1]',
                    (isWeekStart || isWeekEnd) ? 'font-bold' : 'font-medium',
                    !inCurrentMonth && !inSelectedWeek ? 'text-[#d8cab8]' : '',
                    inCurrentMonth && !inSelectedWeek ? 'text-[#3d2410]' : '',
                    inSelectedWeek ? 'text-white' : '',
                    isWeekStart ? 'rounded-l-md' : '',
                    isWeekEnd ? 'rounded-r-md' : '',
                    isToday && !inSelectedWeek ? 'ring-1 ring-[#5C3317] rounded-md' : '',
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e7ded4]">
            <button type="button" onClick={() => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))} className="text-[11px] font-medium text-[#9a8b7a] hover:text-[#5C3317]">
              This month
            </button>
            <button type="button" onClick={() => { onChange(dateUtils('startOfWeek', today)); setOpen(false); }} className="text-[11px] font-medium text-[#5C3317] hover:underline">
              This week
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
  const [weekStart, setWeekStart] = useState(dateUtils('startOfWeek', new Date()));

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
        <WeekRangePicker weekStart={weekStart} onChange={setWeekStart} />
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