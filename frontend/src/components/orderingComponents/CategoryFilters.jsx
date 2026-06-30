const categories = [
  "ALL",
  "PASTRY",
  "PACKAGE",
  "CELEBRATION MATERIAL",
];

export default function CategoryFilters({
  selectedCategory,
  filterCategory,
}) {
  return (
    <section className="bg-[#F8F6F3] py-6 border-b">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-wrap gap-4">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterCategory(category)}
              className={`px-7 py-3 rounded-full uppercase tracking-wider text-sm transition

                ${
                  selectedCategory === category
                    ? "bg-[#5A3B2E] text-white"
                    : "bg-[#EFE8E3] text-[#8A6A59] hover:bg-[#DDD]"
                }
              `}
            >
              {category}
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}