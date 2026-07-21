// =============================================================================
// Week 6 — Day 1: System Integration Testing and Bug Fixing
// Feature: Integrated POS System (Product Search)
// -----------------------------------------------------------------------------
// Search input for filtering products by name in the POS page.
// Part of the integrated POS frontend search-and-filter toolbar.
// =============================================================================

import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <label className="w-full flex items-center gap-[clamp(0.4rem,1.2vw,0.75rem)] px-[clamp(0.65rem,2vw,1.25rem)] py-[clamp(0.35rem,1.2vw,0.625rem)] bg-white border border-[#e7cfc8] rounded-[9px]">
      <Search className="text-[#d0aaa1] flex-shrink-0 w-[clamp(0.9rem,2vw,1.25rem)] h-[clamp(0.9rem,2vw,1.25rem)]" />

      <input
        className="w-full min-w-0 outline-none text-[clamp(0.75rem,1.8vw,1rem)] text-[#6f5148] placeholder-[#d3aaa3] bg-transparent"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </label>
  );
}