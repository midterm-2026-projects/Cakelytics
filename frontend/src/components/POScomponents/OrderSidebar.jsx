export default function OrderSidebar({ 
  cart, 
  subtotal, 
  additional, 
  setAdditional, 
  discount, 
  setDiscount, 
  total, 
  updateQuantity, // Bagong function prop
  removeItem      // Bagong function prop
}) {
  return (
    <aside className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-[#f0e6e4] h-fit">
      <h2 className="font-bold text-lg mb-4">Current Order</h2>
      
      <div className="min-h-[200px] mb-4">
        {cart.length === 0 ? (
          <div className="text-center py-20 text-[#c48479]">
            <p>Wala pang items.</p>
            <p className="text-sm">Pumili ng produkto sa kaliwa.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 border-b pb-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>{item.name}</span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="px-3 py-1 hover:bg-gray-100"
                    >-</button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="px-3 py-1 hover:bg-gray-100"
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financials */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between"><span>Subtotal</span> <span>₱{subtotal.toFixed(2)}</span></div>
        
        <div className="flex justify-between items-center">
          <span>Additional Charge</span>
          <input type="number" className="w-20 border rounded p-1 text-right" value={additional} onChange={(e) => setAdditional(Number(e.target.value))} />
        </div>

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <input type="number" className="w-20 border rounded p-1 text-right" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>GRAND TOTAL</span>
          <span>₱{total.toFixed(2)}</span>
        </div>

        <button className="w-full bg-[#2d1712] text-white py-3 rounded-lg mt-4 hover:bg-[#4a261d] transition">
          Complete Order
        </button>
      </div>
    </aside>
  );
}