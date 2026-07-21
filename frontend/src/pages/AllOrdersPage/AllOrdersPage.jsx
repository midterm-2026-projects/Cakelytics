import { useEffect, useMemo, useState, useCallback } from "react";
import { QrCode, X, Phone, Calendar, Download, MessageSquare, Loader2 } from "lucide-react";

import OrdersSearchBar from "../../components/AllOrdersComponents/Ordersearchbar";
import Orderstatusfilter from "../../components/AllOrdersComponents/Orderstatusfilter";
import Orderspagination from "../../components/AllOrdersComponents/Orderspagination";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const PAGE_SIZE = 8;

const normalizeOrder = (row) => {
  const id = row?.id;
  const orderNumber = row?.order_number ?? row?.id ?? "N/A";
  const orderType = row?.order_type ?? row?.type ?? "";
  const rawCustomer = row?.customer_name ?? row?.customer ?? row?.customers?.name ?? "";
  
  const customer = rawCustomer && rawCustomer.trim() !== "" 
    ? rawCustomer 
    : (orderType.toLowerCase().includes("pre") ? "Pre-Order Customer" : "Walk-in");

  const phone = row?.phone_number ?? row?.phone ?? row?.customers?.phone ?? "";
  const type = orderType;
  const status = row?.status ?? "";
  const amount = Number(row?.grand_total ?? row?.amount ?? 0);

  const paymentType = row?.payment_type ?? row?.payment ?? "";
  const payment =
    paymentType === "deposit" ? "deposit" : paymentType === "full" ? "paid" : paymentType;

  const deposit = Number(row?.deposit ?? (paymentType === "deposit" ? amount / 2 : amount));
  const balance = Number(row?.balance ?? (paymentType === "deposit" ? amount - deposit : 0));

  const items = row?.items ?? row?.order_items ?? [
    { name: type || "Custom Cake Item", qty: 1, price: amount }
  ];

  return {
    id,
    orderNumber,
    customer,
    phone,
    type,
    amount,
    payment,
    deposit,
    balance,
    pickupDate: row?.pickup_date ?? row?.pickupDate ?? "",
    pickupTime: row?.pickup_time ?? row?.pickupTime ?? "",
    status,
    items,
    referenceImage: row?.reference_image ?? row?.referenceImage ?? row?.image_url ?? null,
    specialInstructions: row?.special_instructions ?? row?.specialInstructions ?? row?.notes ?? "",
    raw: row,
  };
};

const typeStyle = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("pre")) return "bg-purple-100 text-purple-700";
  if (t.includes("buy")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
};

const statusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "confirmed") return "bg-blue-100 text-blue-700";
  if (s === "ready") return "bg-green-100 text-green-700";
  if (s === "completed") return "bg-gray-200 text-gray-700";
  if (s === "cancelled") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};

const formatMoney = (n) =>
  `₱${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPickup = (order) => {
  if (!order?.pickupDate) return "—";
  try {
    const d = new Date(order.pickupDate);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return order.pickupTime ? `${dateStr} — ${order.pickupTime}` : dateStr;
  } catch {
    return order.pickupTime ? `${order.pickupDate} — ${order.pickupTime}` : order.pickupDate;
  }
};

export default function AllOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status && status !== "All") params.set("status", status);

      const url = `${API_BASE}/orders${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const rawText = await res.text().catch(() => "");
      let body = {};
      try {
        body = rawText ? JSON.parse(rawText) : {};
      } catch {
        body = { parseError: true, rawText: rawText?.slice(0, 500) };
      }

      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || body?.rawText || `Failed to load orders (HTTP ${res.status})`);
      }

      const ordersArray = body?.data ?? [];
      setOrders((Array.isArray(ordersArray) ? ordersArray : []).map(normalizeOrder));
    } catch (e) {
      console.error("Fetch failed:", e);
      setError(e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(activeStatus);
    setCurrentPage(1);
  }, [activeStatus, fetchOrders]);

  useEffect(() => {
    if (!selectedOrderId) {
      setModalData(null);
      setModalError(null);
      return;
    }

    const fetchOrderDetails = async () => {
      setModalLoading(true);
      setModalError(null);
      try {
        const url = `${API_BASE}/orders/${selectedOrderId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const rawText = await res.text().catch(() => "");
        let body = {};
        try {
          body = rawText ? JSON.parse(rawText) : {};
        } catch {
          body = { data: null };
        }

        if (!res.ok) {
          throw new Error(body?.message || `Failed to fetch details for order #${selectedOrderId}`);
        }

        const rawRecord = body?.data ?? body;
        setModalData(normalizeOrder(rawRecord));
      } catch (err) {
        console.error("Failed to fetch order details from DB:", err);
        setModalError(err.message || "Failed to load order details.");
        const fallback = orders.find(o => String(o.id) === String(selectedOrderId));
        setModalData(fallback || null);
      } finally {
        setModalLoading(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrderId, orders]);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrderId) return;
    setActionLoading(true);
    try {
      const formattedStatus = newStatus.toLowerCase() === "ready" ? "Ready" : "Cancelled";

      const res = await fetch(`${API_BASE}/orders/${selectedOrderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: formattedStatus }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || "Failed to update status in database");
      }

      await fetchOrders(activeStatus);
      setSelectedOrderId(null);
      alert(`Order has been successfully marked as ${formattedStatus}!`);
    } catch (err) {
      console.error("Status update error:", err);
      alert(`Error updating status: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        String(o?.orderNumber).toLowerCase().includes(s) || (o?.customer || "").toLowerCase().includes(s);
      const matchesStatus = activeStatus === "All" || o?.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, activeStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAF5F4]">
      <main className="flex-1 overflow-y-auto p-6 md:p-8 text-[#2d1712] font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <OrdersSearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />
              <Orderstatusfilter activeStatus={activeStatus} setActiveStatus={handleFilterChange} />
            </div>

            <button className="flex items-center gap-2 bg-[#53362f] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4a332a] transition-colors shadow-sm flex-shrink-0">
              <QrCode size={16} />
              Scan Receipt QR
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          <div className="bg-white border border-[#F0DFDA] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="bg-[#FAF5F4]">
                  <tr className="text-left text-sm text-[#6f5148]">
                    <th className="px-4 py-3 font-bold">Order ID</th>
                    <th className="px-4 py-3 font-bold">CUSTOMER</th>
                    <th className="px-4 py-3 font-bold">TYPE</th>
                    <th className="px-4 py-3 font-bold">AMOUNT</th>
                    <th className="px-4 py-3 font-bold">PAYMENT</th>
                    <th className="px-4 py-3 font-bold">PICK-UP / DATE</th>
                    <th className="px-4 py-3 font-bold">STATUS</th>
                    <th className="px-4 py-3 font-bold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-20 text-center text-sm text-[#8A7F74]">
                        {loading ? "Loading orders from database..." : "No orders found."}
                      </td>
                    </tr>
                  ) : (
                    paginated.map((order) => (
                      <tr key={order.id} className="border-t border-[#F0DFDA]">
                        <td className="px-4 py-3 text-sm font-semibold text-[#2d1712] whitespace-nowrap">#{order.orderNumber}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-[#2d1712]">{order.customer}</div>
                          {order.phone && <div className="text-xs text-[#8d6459] mt-0.5">{order.phone}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${typeStyle(order.type)}`}>
                            {order.type || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#2d1712] whitespace-nowrap">
                          {formatMoney(order.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.payment === "deposit" ? (
                            <>
                              <div className="text-sm font-bold text-orange-700">Deposit {formatMoney(order.deposit)}</div>
                              <div className="text-xs text-[#8d6459] mt-0.5">Balance {formatMoney(order.balance)}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-bold text-green-700">Fully Paid</div>
                              <div className="text-xs text-[#8d6459] mt-0.5">{formatMoney(order.amount)}</div>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#2d1712] whitespace-nowrap">{formatPickup(order)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${statusStyle(order.status)}`}>
                            {order.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderId(order.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#F0DFDA] hover:bg-[#FAF5F4] whitespace-nowrap cursor-pointer transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Orderspagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </main>

      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-[#F0DFDA] flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0DFDA] bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#2d1712]">
                  Order #{modalData?.orderNumber || selectedOrderId}
                </h2>
                {modalData && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle(modalData.status)}`}>
                    {modalData.status || "CONFIRMED"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {modalLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-3 bg-[#FAF5F4]/30">
                <Loader2 className="animate-spin text-[#53362f]" size={36} />
                <p className="text-sm font-semibold text-[#8d6459]">Fetching order details from database...</p>
              </div>
            ) : modalError && !modalData ? (
              <div className="p-10 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200">
                <p>{modalError}</p>
              </div>
            ) : modalData ? (
              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FAF5F4]/30">
                
                <div className="bg-white border border-[#F0DFDA] rounded-xl p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <h3 className="text-xs font-bold text-[#6f5148] uppercase tracking-wider mb-4">Customer Details</h3>
                    <div className="text-lg font-bold text-[#2d1712] mb-3">{modalData.customer}</div>
                    {modalData.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#6f5148] bg-[#FAF5F4] px-3 py-2 rounded-lg w-fit">
                        <Phone size={14} className="text-[#8d6459]" />
                        <span>{modalData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#F0DFDA]">
                    <h3 className="text-xs font-bold text-[#6f5148] uppercase tracking-wider mb-2">Pick-up Schedule</h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2d1712]">
                      <Calendar size={16} className="text-[#8d6459]" />
                      <span>{formatPickup(modalData)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#F0DFDA] rounded-xl p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-[#6f5148]">
                      <span className="text-xs font-bold uppercase tracking-wider">Order Summary</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {Array.isArray(modalData.items) && modalData.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-[#2d1712] font-medium">
                            {item.name || item.title || "Item"} <span className="text-xs text-[#8d6459]">x{item.qty || item.quantity || 1}</span>
                          </span>
                          <span className="font-semibold text-[#2d1712]">
                            {formatMoney((item.price || modalData.amount) * (item.qty || item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#F0DFDA] pt-3 space-y-2">
                      <div className="flex justify-between text-xs text-[#6f5148]">
                        <span>Subtotal</span>
                        <span>{formatMoney(modalData.amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="border-t border-[#F0DFDA] pt-4 mb-4 flex justify-between items-center">
                      <span className="font-bold text-[#2d1712]">Grand Total</span>
                      <span className="text-xl font-extrabold text-green-700">{formatMoney(modalData.amount)}</span>
                    </div>

                    <div className="bg-[#FFF9E6] border border-[#FFE082] rounded-lg p-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800 uppercase">Payment Status</span>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                        {modalData.payment === "deposit" ? `Deposit ${formatMoney(modalData.deposit)}` : "Fully Paid"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-[#F0DFDA] rounded-xl p-4 shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#6f5148] uppercase tracking-wider">Customer Reference</span>
                      {modalData.referenceImage && (
                        <a 
                          href={modalData.referenceImage} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-[#53362f] font-bold flex items-center gap-1 hover:underline"
                        >
                          <Download size={12} /> Save Image
                        </a>
                      )}
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-100 h-36 bg-gray-50 flex items-center justify-center">
                      {modalData.referenceImage ? (
                        <img 
                          src={modalData.referenceImage} 
                          alt="Reference Cake" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No reference image uploaded</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#F0DFDA] rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#6f5148] uppercase tracking-wider mb-2">
                      <MessageSquare size={12} /> Special Instructions
                    </div>
                    <p className="text-xs text-[#2d1712] italic bg-[#FAF5F4] p-3 rounded-lg border border-[#F0DFDA]/50 leading-relaxed">
                      "{modalData.specialInstructions || "No special instructions provided."}"
                    </p>
                  </div>
                </div>

              </div>
            ) : null}

            <div className="px-6 py-4 border-t border-[#F0DFDA] bg-white flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrderId(null)}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-sm font-bold border border-[#F0DFDA] text-[#6f5148] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleUpdateStatus("cancelled")}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Cancel Order
              </button>
              <button
                onClick={() => handleUpdateStatus("ready")}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-[#53362f] text-white hover:bg-[#4a332a] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Mark as Ready
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}