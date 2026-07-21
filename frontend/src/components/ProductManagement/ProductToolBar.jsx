

import React from "react";
import { Search, Plus } from "lucide-react";

const FILTERS = ["All", "Package", "Pastry", "Celebration Material"];

export function ProductToolbar({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onAddProduct,
}) {
  return (
    <div className="flex items-center gap-[14px] mb-6 flex-wrap">
      <div className="relative w-[260px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9B3AC]" />
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-2.5 pl-9 pr-3.5 rounded-full border border-[#E8D5D1] bg-white text-sm outline-none box-border text-[#2C1F1C] placeholder-[#C9B3AC] focus:border-[#4A3530]"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((label) => (
          <button
            key={label}
            onClick={() => onFilterChange(label)}
            className={`px-[18px] py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeFilter === label
                ? "bg-[#4A3530] border-[#4A3530] text-white"
                : "bg-white border-[#E8D5D1] text-[#8B6B64]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button 
        className="ml-auto flex items-center gap-2 px-5 py-[11px] rounded-[10px] border-none bg-[#4A3530] text-white text-sm font-semibold cursor-pointer hover:bg-[#3D2B27] transition-colors" 
        onClick={onAddProduct}
      >
        <Plus size={16} strokeWidth={2.5} />
        Add Product
      </button>
    </div>
  );
}