import { Search } from "lucide-react";

export default function OrdersSearchBar({ searchTerm, setSearchTerm }) {
  return (
    <label className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#e7cfc8] rounded-xl min-w-[260px]">
      <Search size={16} className="text-[#d0aaa1] flex-shrink-0" />
      <input
        className="w-full outline-none text-sm text-[#6f5148] placeholder-[#d3aaa3] bg-transparent"
        placeholder="Search order ID or customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </label>
  );
}