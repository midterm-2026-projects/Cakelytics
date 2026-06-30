export default function CategoryFilters({
  activeCategory,
  setActiveCategory,
}) {
  const categories = ["All", "Package", "Pastry", "Celebration Material"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-6 py-2.5 rounded-full font-extrabold transition-colors border whitespace-nowrap flex-shrink-0 ${
            activeCategory === cat
              ? "bg-[#53362f] text-white border-[#53362f]"
              : "bg-white text-[#8d6459] border-[#e3c9c1]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}