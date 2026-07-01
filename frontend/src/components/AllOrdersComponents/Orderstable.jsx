import OrderStatusBadge from "../AllOrdersComponents/Orderstatusbadge";
import OrderTypeBadge from "../AllOrdersComponents/Ordertypebadge";

const fmt = (n) =>
  "₱" + Number(n).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Orderstable({ orders, onViewDetails }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#c9a89e]">
        <p className="font-bold text-sm">Walang nahanap na order.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#ead6d0]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#53362f] text-white text-xs uppercase tracking-wider">
            <th className="text-left px-5 py-4 font-black rounded-tl-2xl">Order ID</th>
            <th className="text-left px-5 py-4 font-black">Customer</th>
            <th className="text-left px-5 py-4 font-black">Type</th>
            <th className="text-left px-5 py-4 font-black">Amount</th>
            <th className="text-left px-5 py-4 font-black">Payment</th>
            <th className="text-left px-5 py-4 font-black">Pick-Up / Date</th>
            <th className="text-left px-5 py-4 font-black">Status</th>
            <th className="text-left px-5 py-4 font-black rounded-tr-2xl">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr
              key={order.id}
              className={`border-t border-[#f0e4e0] transition-colors hover:bg-[#fdf8f7] ${
                i % 2 === 0 ? "bg-white" : "bg-[#fdfaf9]"
              }`}
            >
              <td className="px-5 py-4 font-mono text-[#9b665b] font-bold text-xs">
                #{order.id}
              </td>
              <td className="px-5 py-4">
                <p className="font-bold text-[#2d1712]">{order.customer}</p>
                <p className="text-xs text-[#b09088] mt-0.5">{order.phone}</p>
              </td>
              <td className="px-5 py-4">
                <OrderTypeBadge type={order.type} />
              </td>
              <td className="px-5 py-4 font-bold text-[#2d1712]">
                {fmt(order.amount)}
              </td>
              <td className="px-5 py-4">
                {order.payment === "deposit" ? (
                  <div>
                    <p className="font-bold text-orange-500 text-xs">
                      Deposit {fmt(order.deposit)}
                    </p>
                    <p className="text-xs text-[#b09088]">Balance {fmt(order.balance)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-green-600 text-xs">Fully Paid</p>
                    <p className="text-xs text-[#b09088]">{fmt(order.deposit)}</p>
                  </div>
                )}
              </td>
              <td className="px-5 py-4 text-[#2d1712]">
                {order.pickupDate} — {order.pickupTime}
              </td>
              <td className="px-5 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-5 py-4">
               <button onClick={() => onViewDetails(order)} className="text-xs font-bold text-[#53362f] bg-[#fbf7f6] border border-[#53362f] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#53362f] hover:text-white">
                View Details
               </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}