import React, { useState } from "react";
import ProductManagementHeader from "../../components/ProductManagement/ProductManagementHeader";
import { ProductToolbar } from "../../components/ProductManagement/ProductToolBar";
import { ProductCard } from "../../components/ProductManagement/ProductCard";

const PRODUCTS = [
  {
    id: 1,
    category: "PACKAGE",
    name: "Package A",
    description: "Themed Cake (7x5) · w/ Printed Toppers · ...",
    price: 1200,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80",
  },
  {
    id: 2,
    category: "PACKAGE",
    name: "Package B",
    description: "Themed Cake (7x5) · w/ Printed Toppers · ...",
    price: 1500,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80",
  },
  {
    id: 3,
    category: "PACKAGE",
    name: "Package C",
    description: "Themed Cake (7x5) · w/ Printed Toppers · ...",
    price: 2000,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80",
  },
  {
    id: 4,
    category: "PACKAGE",
    name: "Package D",
    description: "Themed Cake (7x5) · w/ Printed Toppers · ...",
    price: 3000,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=80",
  },
  {
    id: 5,
    category: "PACKAGE",
    name: "Package E",
    description: "Themed Cake (9x7) · w/ Printed Toppers",
    price: 1000,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80",
  },
  {
    id: 6,
    category: "PACKAGE",
    name: "Package AB",
    description: "12pcs Cupcakes · w/ Balloons",
    price: 1400,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80",
  },
  {
    id: 7,
    category: "PACKAGE",
    name: "Package EA",
    description: "12 pcs Cupcakes",
    price: 2000,
    limit: "Limit: 5/day",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80",
  },
  {
    id: 8,
    category: "CELEBRATION MATERIAL",
    name: "Printed Balloons",
    description: "Round balloons with print (e.g., Happy Birt...",
    price: 15,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  },
];

/* ------------------------------------------------------------------ */
/* Product Grid Component                                             */
/* ------------------------------------------------------------------ */
function ProductGrid({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="py-[60px] text-center text-[#8A7F74] text-sm">
        No products match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function ProductManagementPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      p.category.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#FAF5F4] min-h-screen font-sans text-[#2C1F1C]">
      <ProductManagementHeader />

      <main className="px-8 py-6 pb-12">
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddProduct={() => alert("Add product clicked")}
        />

        <ProductGrid
          products={filtered}
          onEdit={(p) => alert(`Edit ${p.name}`)}
          onDelete={(p) => alert(`Delete ${p.name}`)}
        />
      </main>
    </div>
  );
}