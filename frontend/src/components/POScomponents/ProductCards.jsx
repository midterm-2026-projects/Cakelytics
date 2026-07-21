// =============================================================================
// Week 6 — Day 1: System Integration Testing and Bug Fixing
// Feature: Integrated POS System (Product Cards Display)
// -----------------------------------------------------------------------------
// Renders products grouped by category in a responsive grid layout.
// Each card displays product image, name, stock level, and price with
// an "ADD" button to include items in the cart for checkout.
// =============================================================================

import { Plus } from "lucide-react";

export default function ProductCards({ products, onAddToCart }) {
  const groups = [];
  const map = new Map();

  for (const product of products) {
    const category = product.category || "Uncategorized";

    if (!map.has(category)) {
      map.set(category, groups.length);
      groups.push({
        category,
        items: [],
      });
    }

    groups[map.get(category)].items.push(product);
  }

  return (
    <div className="mt-5 space-y-8">
      {groups.map((group) => (
        <section key={group.category}>
          {/* Category */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-bold tracking-wider uppercase">
              {group.category}
            </h2>

            <div className="flex-1 border-b border-[#ead2cc]" />

            <span className="text-xs text-[#c08d75]">
              {group.items.length} items
            </span>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.items.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#EFD9D2] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative h-[145px] overflow-hidden bg-[#fafafa]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/products/default.png";
                    }}
                  />

                  <span className="absolute top-2 right-2 bg-[#4E4039]/90 text-white text-[11px] font-semibold rounded-full px-2 py-1">
                    Stock: {product.stock ?? 10}
                  </span>
                </div>

                {/* Content */}
                <div className="px-3 py-3">
                  <h3 className="font-semibold text-[17px] truncate text-[#2B1C16]">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-[#3D2A22] text-lg">
                      ₱{Number(product.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() =>
                        onAddToCart({
                          id: product.id,
                          name: product.name,
                          category: product.category,
                          price: product.price,
                          image: product.image,
                          details: product.details,
                        })
                      }
                      className="flex items-center gap-1 bg-[#6B4638] hover:bg-[#5a392d] text-white rounded-lg px-3 py-1.5 text-xs font-bold transition"
                    >
                      <Plus size={13} />
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}