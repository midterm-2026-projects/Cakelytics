export default function Orderstable({ orders = [], onViewDetails }) {
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

  const formatMoney = (n) => `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPickup = (order) => {
    if (!order.pickupDate) return "—";
    try {
      const d = new Date(order.pickupDate);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return order.pickupTime ? `${dateStr} — ${order.pickupTime}` : dateStr;
    } catch {
      return order.pickupTime ? `${order.pickupDate} — ${order.pickupTime}` : order.pickupDate;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#F0DFDA] rounded-2xl py-20 text-center text-sm text-[#8A7F74]">
        No orders found.
      </div>
    );
  }

  const headers = [
    "Order ID",
    "Customer",
    "Type",
    "Amount",
    "Payment",
    "Pick-up / Date",
    "Status",
    "Action",
  ];

  return (
    <div className="bg-white border border-[#F0DFDA] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full">
          <thead className="bg-[#53362f]">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-[13px] font-bold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[#F0DFDA] hover:bg-[#FAF5F4] transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-[#2d1712] whitespace-nowrap">
                  #{order.id}
                </td>

                <td className="px-5 py-4">
                  <div className="text-sm font-semibold text-[#2d1712]">{order.customer || "—"}</div>
                  {order.phone && (
                    <div className="text-xs text-[#8d6459] mt-0.5">{order.phone}</div>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${typeStyle(order.type)}`}
                  >
                    {order.type || "—"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-bold text-[#2d1712] whitespace-nowrap">
                  {formatMoney(order.amount)}
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
                  {order.payment === "deposit" ? (
                    <>
                      <div className="text-sm font-bold text-orange-700">
                        Deposit {formatMoney(order.deposit)}
                      </div>
                      <div className="text-xs text-[#8d6459] mt-0.5">
                        Balance {formatMoney(order.balance)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-bold text-green-700">Fully Paid</div>
                      <div className="text-xs text-[#8d6459] mt-0.5">{formatMoney(order.amount)}</div>
                    </>
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-[#2d1712] whitespace-nowrap">
                  {formatPickup(order)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusStyle(order.status)}`}
                  >
                    {order.status || "—"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(order)}
                    className="px-4 py-2 rounded-lg text-xs font-bold border border-[#F0DFDA] hover:bg-[#FAF5F4] whitespace-nowrap"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}