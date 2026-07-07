import { Sparkles } from 'lucide-react';

const AI_COLORS = {
  success: { color: '#10b981', tagBg: '#d1fae5', tagTxt: '#065f46' },
  warning: { color: '#f59e0b', tagBg: '#fef3c7', tagTxt: '#92400e' },
  danger:  { color: '#f43f5e', tagBg: '#fee2e2', tagTxt: '#b91c1c' },
  info:    { color: '#3b82f6', tagBg: '#dbeafe', tagTxt: '#1e40af' },
  neutral: { color: '#8b5cf6', tagBg: '#ede9fe', tagTxt: '#5b21b6' },
};

// ─── MOCK DATA ─────────────────────────────────────────────────
const MOCK_RECOMMENDATIONS = [
  {
    badge: "DISKARTE",
    title: "I-highlight ang Mocha Dedication Cake",
    desc: "Dahil trending ang Mocha Cake ngayon, mag-post ng magagandang pictures nito sa Facebook page para makakuha ng mas maraming walk-in at pre-orders.",
    type: "success"
  },
  {
    badge: "PROMO",
    title: "Cupcake Weekend Bundle",
    desc: "Bumababa ang benta ng Strawberry Cupcakes. Subukang i-bundle ito nang may discount kapag bumili ng kahit anong whole cake tuwing weekend.",
    type: "info"
  },
  {
    badge: "TANDAAN",
    title: "Focus sa Celebration Sales",
    desc: "Ayon sa sales trend analytics, tumataas ang demand tuwing katapusan ng buwan (payday). I-ready ang inyong social media marketing materials 3 araw bago ang payday.",
    type: "warning"
  }
];

export default function ActionableRecommendation({ recommendations = MOCK_RECOMMENDATIONS }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="w-full bg-white border border-brand-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 sm:px-5 py-4 border-b border-brand-100 flex items-center gap-2.5 bg-gray-50/50">
        <Sparkles size={18} className="text-brand-500" />
        <h3 className="text-[13px] font-black text-brand-700 uppercase tracking-widest">
          Actionable Recommendations
        </h3>
      </div>
      
      {/* Recommendations List */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 flex-1">
        {recommendations.map((ins, i) => {
          const theme = AI_COLORS[ins.type] || AI_COLORS.neutral;
          
          return (
            <div
              key={i}
              className="border border-slate-200 rounded-xl p-4 sm:p-5 transition-all hover:shadow-sm"
              style={{ borderLeft: `4px solid ${theme.color}` }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block"
                  style={{ background: theme.tagBg, color: theme.tagTxt }}
                >
                  {ins.badge}
                </span>
              </div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-brand-900 mb-1.5 leading-snug">
                {ins.title}
              </h4>
              <p className="text-[13px] text-brand-600 leading-relaxed">
                {ins.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}