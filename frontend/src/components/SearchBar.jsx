import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <label className="flex-1 min-w-[280px] flex items-center gap-3 px-5 py-3 bg-white border border-[#e7cfc8] rounded-[9px]">
      <Search className="text-[#d0aaa1]" size={20} />

      <input
        className="w-full outline-none text-[#6f5148] placeholder-[#d3aaa3] bg-transparent"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </label>
  );
}