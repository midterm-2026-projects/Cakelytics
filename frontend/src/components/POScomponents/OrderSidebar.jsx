import { useState } from "react";

export default function OrderSidebar({
  cart,
  subtotal,
  additional,
  setAdditional,
  discount,
  setDiscount,
  total,
  updateQuantity,
  removeItem,
  onCompleteOrder,
  completeLabel = "Complete Order",
}) {
  const hasItems = cart.length > 0;
  const [showOptions, setShowOptions] = useState(false);

  return (
    <aside className="h-full flex flex-col bg-white overflow-hidden">
      {/* Scrollable Cart */}
      <div className="flex-1 overflow-y-auto p-[clamp(0.65rem,2vw,1.25rem)]">
        {!hasItems ? (
          <div className="h-full flex flex-col justify-center items-center text-center text-[#c48479] py-16 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 text-gray-300 w-[clamp(3rem,8vw,4rem)] h-[clamp(3rem,8vw,4rem)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.837l.383 1.437m0 0L6.75 13.5a2.25 2.25 0 002.175 1.75h7.59a2.25 2.25 0 002.175-1.75l1.205-6.025H5.106zM9 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm9 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>

            <p className="font-semibold text-[clamp(0.9rem,2vw,1.125rem)]">Wala pang items.</p>
            <p className="text-[clamp(0.75rem,1.6vw,0.875rem)]">Pumili ng produkto sa kaliwa.</p>
          </div>
        ) : (
          <div className="space-y-[clamp(0.5rem,1.5vw,1rem)]">
            {cart.map((item) => (
              <div key={item.id} className="border border-[#F0DFDA] rounded-xl p-3">
                <div className="flex justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[clamp(0.8rem,1.8vw,1rem)] text-[#2B1C16] truncate">
                      {item.name}
                    </h3>
                    <p className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-gray-500">
                      ₱{item.price.toFixed(2)}
                    </p>
                    <p className="font-bold text-[clamp(0.8rem,1.8vw,1rem)] text-[#2B1C16]">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center border border-[#ead2cc] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="-"
                      className="px-3 py-1 hover:bg-gray-100 text-[#2B1C16]"
                    >
                      −
                    </button>

                    <span className="px-4 text-sm font-bold">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="+"
                      className="px-3 py-1 hover:bg-gray-100 text-[#2B1C16]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="delete"
                    className="text-red-500 text-[clamp(0.7rem,1.5vw,0.875rem)] hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#F0DFDA] p-[clamp(0.65rem,2vw,1.25rem)] space-y-[clamp(0.5rem,1.5vw,1rem)]">
        {/* Collapsible Discounts & Options */}
        <div className="border border-[#F0DFDA] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOptions((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-[clamp(0.65rem,1.4vw,0.75rem)] font-extrabold tracking-[.4px] text-[#8d6459] uppercase"
          >
            Discounts &amp; Options
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${showOptions ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOptions && (
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[#F0DFDA]">
              <div className="flex justify-between items-center gap-2 font-medium">
                <span className="text-[clamp(0.75rem,1.6vw,0.875rem)] text-[#6f5148]">Subtotal</span>
                <span className="font-bold text-[clamp(0.75rem,1.6vw,0.875rem)] text-[#2B1C16]">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-[clamp(0.75rem,1.6vw,0.875rem)] text-[#6f5148]">Additional</span>
                <input
                  type="number"
                  value={additional}
                  min={0}
                  step="1"
                  onChange={(e) => setAdditional(Number(e.target.value))}
                  className="min-w-0 border border-[#F0DFDA] rounded-lg p-2 text-right text-[clamp(0.75rem,1.6vw,0.875rem)] w-[clamp(3.5rem,12vw,6rem)]"
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-[clamp(0.75rem,1.6vw,0.875rem)] text-[#6f5148]">Discount</span>
                <input
                  type="number"
                  value={discount}
                  min={0}
                  step="1"
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="min-w-0 border border-[#F0DFDA] rounded-lg p-2 text-right text-[clamp(0.75rem,1.6vw,0.875rem)] w-[clamp(3.5rem,12vw,6rem)]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-2 text-[clamp(1rem,2.2vw,1.25rem)] font-bold">
          <span className="text-[#2B1C16]">GRAND TOTAL</span>
          <span className="text-[#2B1C16]">₱{total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          disabled={!hasItems}
          onClick={onCompleteOrder}
          className="w-full bg-[#2d1712] hover:bg-[#4d2a20] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition py-[clamp(0.6rem,2vw,1rem)] text-[clamp(0.8rem,1.8vw,1rem)]"
        >
          {completeLabel}
        </button>
      </div>
    </aside>
  );
}