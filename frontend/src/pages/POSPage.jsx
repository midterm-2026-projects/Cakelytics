import { useState } from "react";

import SearchBar from "../components/SearchBar";
import CategoryFilters from "../components/CategoryFilter";
import ProductCard from "../components/ProductCards";

import { products } from "../data/products";

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#fbf7f6] p-4 md:p-8 text-[#2d1712] font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <CategoryFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6 text-[#9b665b] uppercase font-black text-[13px] tracking-[0.12em]">
          <span>{activeCategory}</span>

          <div className="flex-1 h-[1px] bg-[#ead6d0]" />

          <small className="text-[#c48479] font-medium">
            {filteredProducts.length} items
          </small>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </section>

      </div>
    </main>
  );
}
