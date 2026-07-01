import { useState, useMemo } from "react";
import { QrCode } from "lucide-react";

import AllOrdersHeader from "../../components/AllOrdersComponents/AllOrdersHeader";
import OrdersSearchBar from "../../components/AllOrdersComponents/Ordersearchbar";
import Orderstatusfilter from "../../components/AllOrdersComponents/Orderstatusfilter";
import Orderstable from "../../components/AllOrdersComponents/Orderstable";
import Orderspagination from "../../components/AllOrdersComponents/Orderspagination";


import { ordersData } from "../../data/Ordersdata";

const PAGE_SIZE = 8;

export default function AllOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return ordersData.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeStatus === "All" || o.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewDetails = (order) => {
    alert(`Viewing details for #${order.id} — ${order.customer}`);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fbf7f6]">
      <AllOrdersHeader userName="Evangeline V." notificationCount={1} />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 text-[#2d1712] font-sans">
        <div className="max-w-7xl mx-auto">

          {/* Page title + top controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-black text-[#2d1712]">All Orders</h1>
            <button className="flex items-center gap-2 bg-[#53362f] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4a332a] transition-colors shadow-sm">
              <QrCode size={16} />
              Scan Receipt QR
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <OrdersSearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />
            <Orderstatusfilter activeStatus={activeStatus} setActiveStatus={handleFilterChange} />
          </div>

          {/* Table */}
          <Orderstable orders={paginated} onViewDetails={handleViewDetails} />

          {/* Pagination */}
          <Orderspagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </main>
    </div>
  );
}
