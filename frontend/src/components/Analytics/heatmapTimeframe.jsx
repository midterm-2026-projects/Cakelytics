import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LETTERS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

// --- Date utilities (Internal helper lang, hindi ini-export) ---
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

// --- Timeframe / week range selector ---
// Nilagyan na natin ng default props para hindi mag-undefined kapag ni-load nang mag-isa
export default function HeatmapTimeframe({ 
  weekStart = dateUtils('startOfWeek', new Date()), 
  onChange = () => {} 
}) {
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
    <div className="relative w-fit shrink-0" ref={containerRef}>
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
        <div role="dialog" aria-label="Select week" className="absolute right-0 mt-1.5 z-20 w-70 bg-white border border-[#e7ded4] rounded-xl shadow-lg p-3">
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