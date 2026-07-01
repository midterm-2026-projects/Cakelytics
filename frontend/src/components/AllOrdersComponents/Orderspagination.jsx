import { ChevronRight, ChevronLeft } from "lucide-react";

export default function OrdersPagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const btnBase =
    "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors border";

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-[#9b665b]">
        Showing {start}–{end} of {totalItems} Orders
      </p>

      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          type="button"
          aria-label="Prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} border-[#ead6d0] bg-white text-[#9b665b] hover:bg-[#f9efee] disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            type="button"
            aria-label={`Page ${page}`}
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? "bg-[#53362f] text-white border-[#53362f] shadow-md"
                : "bg-white border-[#ead6d0] text-[#6f5148] hover:bg-[#f9efee]"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          aria-label="Next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} border-[#ead6d0] bg-white text-[#9b665b] hover:bg-[#f9efee] disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
