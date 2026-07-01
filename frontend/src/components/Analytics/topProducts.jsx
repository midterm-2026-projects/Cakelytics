import { ShoppingBag } from 'lucide-react';

// ─── Constants ─────────────────────────────────────────────────
const RANK_STYLES = [
  'bg-amber-100 text-amber-800',
  'bg-slate-100 text-slate-600',
  'bg-orange-100 text-orange-800',
  'bg-[#f3ede4] text-[#9a8b7a]',
  'bg-[#f3ede4] text-[#9a8b7a]',
];

const DEFAULT_PRODUCTS = [
  { name: 'Package B', sold: 68 },
  { name: 'Package A', sold: 51 },
  { name: 'Ensaymada', sold: 45 },
  { name: 'Cupcake', sold: 38 },
  { name: 'Brownies', sold: 32 },
];

export default function TopProductsList({
  products = DEFAULT_PRODUCTS,
  title = 'Top 5 Best Selling Products',
  subtitle = 'Pinakamabentang items · Day',
  maxItems = 5,
}) {
  const items = (products || []).slice(0, maxItems);
  const isEmpty = items.length === 0;
  const maxSold = isEmpty ? 1 : Math.max(1, ...items.map((p) => p.sold || 0));

  return (
    <div className="w-full p-4 sm:p-5 bg-white border border-[#e7ded4] rounded-xl flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag size={18} className="text-[#5C3317] shrink-0" />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#3d2410] truncate">{title}</h3>
          <p className="text-xs text-[#9a8b7a] mt-0.5">{subtitle}</p>
        </div>
      </div>

      {isEmpty ? (
        <div
          role="status"
          className="flex items-center justify-center h-32 text-sm text-[#9a8b7a] border border-dashed border-[#e7ded4] rounded-lg"
        >
          No product data available.
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 justify-between">
          {items.map((p, i) => {
            const pct = Math.round(((p.sold || 0) / maxSold) * 100);
            return (
              <div key={p.name}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                      RANK_STYLES[i] || RANK_STYLES[RANK_STYLES.length - 1]
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-[#3d2410] font-semibold flex-1 truncate">
                    {p.name}
                  </span>
                  <span className="text-[14px] font-bold text-[#241406] tabular-nums whitespace-nowrap">
                    {(p.sold || 0).toLocaleString()}
                    <span className="text-[10px] text-[#9a8b7a] font-normal ml-0.5">pcs</span>
                  </span>
                </div>
                <div className="h-1.5 bg-[#f3ede4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}