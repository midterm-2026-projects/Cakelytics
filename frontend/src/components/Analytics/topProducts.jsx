import { ShoppingBag } from 'lucide-react';

const RANK_STYLES = [
  'bg-amber-100 text-amber-800',
  'bg-slate-100 text-slate-600',
  'bg-orange-100 text-orange-800',
  'bg-[#f3ede4] text-[#9a8b7a]',
  'bg-[#f3ede4] text-[#9a8b7a]',
];

// ─── KUMPLETONG DYNAMIC DATA ────────────────────────────────────────
const PRODUCTS_MAP = {
  'Today': [ { name: 'Ensaymada', sold: 18 }, { name: 'Cupcake', sold: 15 }, { name: 'Package A', sold: 8 }, { name: 'Brownies', sold: 6 }, { name: 'Mocha Cake', sold: 2 } ],
  'Yesterday': [ { name: 'Cupcake', sold: 22 }, { name: 'Ensaymada', sold: 16 }, { name: 'Brownies', sold: 12 }, { name: 'Package B', sold: 5 }, { name: 'Vanilla Roll', sold: 4 } ],
  'Last 7 Days': [ { name: 'Package B', sold: 68 }, { name: 'Package A', sold: 51 }, { name: 'Ensaymada', sold: 45 }, { name: 'Cupcake', sold: 38 }, { name: 'Brownies', sold: 32 } ],
  'Last 30 Days': [ { name: 'Package B', sold: 310 }, { name: 'Package A', sold: 245 }, { name: 'Mocha Cake', sold: 180 }, { name: 'Ensaymada', sold: 165 }, { name: 'Brownies', sold: 140 } ],
  'This Month': [ { name: 'Package B', sold: 280 }, { name: 'Package A', sold: 210 }, { name: 'Ensaymada', sold: 145 }, { name: 'Cupcake', sold: 130 }, { name: 'Brownies', sold: 115 } ],
  'This Year': [ { name: 'Package B', sold: 3500 }, { name: 'Package A', sold: 2800 }, { name: 'Mocha Cake', sold: 2100 }, { name: 'Ensaymada', sold: 1950 }, { name: 'Custom Fondant', sold: 1200 } ],
};

export default function TopProductsList({
  period = 'Last 7 Days',
  title = 'Top 5 Best Selling Products',
  maxItems = 5,
}) {
  const products = PRODUCTS_MAP[period] || PRODUCTS_MAP['Last 30 Days'];
  
  const items = (products || []).slice(0, maxItems);
  const isEmpty = items.length === 0;
  const maxSold = isEmpty ? 1 : Math.max(1, ...items.map((p) => p.sold || 0));

  return (
    <div className="w-full p-4 sm:p-5 bg-white border border-[#e7ded4] rounded-xl flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag size={18} className="text-[#5C3317] shrink-0" />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#3d2410] truncate">{title}</h3>
          <p className="text-xs text-[#9a8b7a] mt-0.5">Pinakamabentang items · {period}</p>
        </div>
      </div>

      {isEmpty ? (
        <div role="status" className="flex items-center justify-center h-32 text-sm text-[#9a8b7a] border border-dashed border-[#e7ded4] rounded-lg">
          No product data available.
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 justify-between">
          {items.map((p, i) => {
            const pct = Math.round(((p.sold || 0) / maxSold) * 100);
            return (
              <div key={p.name}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold shrink-0 ${RANK_STYLES[i] || RANK_STYLES[RANK_STYLES.length - 1]}`}>
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-[#3d2410] font-semibold flex-1 truncate">{p.name}</span>
                  <span className="text-[14px] font-bold text-[#241406] tabular-nums whitespace-nowrap">
                    {(p.sold || 0).toLocaleString()}
                    <span className="text-[10px] text-[#9a8b7a] font-normal ml-0.5">pcs</span>
                  </span>
                </div>
                <div className="h-1.5 bg-[#f3ede4] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}