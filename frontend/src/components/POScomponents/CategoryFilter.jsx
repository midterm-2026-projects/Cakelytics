// =============================================================================
// Week 6 — Day 1: System Integration Testing and Bug Fixing
// Feature: Integrated POS System (Category Filter)
// -----------------------------------------------------------------------------
// Filter pills for product categories in the POS page, allowing users to
// filter by Package, Pastry, or Celebration Material.
// =============================================================================

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  const categories = ["Package", "Pastry", "Celebration Material"];

  const pillClass = (isActive) =>
    `px-[clamp(0.65rem,2vw,1.25rem)] py-[clamp(0.3rem,1vw,0.5rem)] text-[clamp(0.65rem,1.6vw,0.875rem)] rounded-full font-bold transition-colors border whitespace-nowrap flex-shrink-0 ${
      isActive
        ? "bg-[#53362f] text-white border-[#53362f]"
        : "bg-white text-[#8d6459] border-[#e3c9c1]"
    }`;

  return (
    <div className="flex gap-[clamp(0.35rem,1vw,0.5rem)] overflow-x-auto pb-1 scrollbar-hide">
      {/* All */}
      <button
        key="All"
        onClick={() => setActiveCategory("All")}
        className={pillClass(activeCategory === "All")}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={pillClass(activeCategory === cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}