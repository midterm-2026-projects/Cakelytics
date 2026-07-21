import React, { useEffect, useMemo, useState } from "react";
import { Clock, Calendar, User } from "lucide-react";
import SearchBar from "../../components/POScomponents/SearchBar";
import CategoryFilter from "../../components/POScomponents/CategoryFilter";
import ProductCards from "../../components/POScomponents/ProductCards";
import OrderSidebar from "../../components/POScomponents/OrderSidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mode, setMode] = useState("Now");
  const [products, setProducts] = useState([]);
  const [pageError, setPageError] = useState("");
  const [cart, setCart] = useState([]);
  const [additional, setAdditional] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [showCustomerDetails, setShowCustomerDetails] = useState(true);

  // New states for the Review Order modal and cash flow
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cashTendered, setCashTendered] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setPageError("");
        const response = await fetch(
          `${API_BASE}/products?category=${activeCategory === "All" ? "" : encodeURIComponent(activeCategory)}&search=${encodeURIComponent(searchTerm)}`
        );
        const body = await response.json();

        const data = body?.data || [];

        const liveProducts = data.map((prod) => ({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: Number(prod.price),
          stock:
            (prod.stock_quantity ?? prod.daily_limit ?? 1) > 0
              ? "Available"
              : "Out of Stock",
          image: prod.image_url || "/products/chocolate-rolls.jpg",
        }));

        if (isMounted) setProducts(liveProducts);
      } catch (err) {
        console.error("POS - product retrieval failed:", err);
        if (isMounted) setProducts([]);
        setPageError("Failed to load products.");
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const total = useMemo(
    () => Math.max(0, subtotal + additional - discount),
    [subtotal, additional, discount]
  );

  const changeDue = useMemo(
    () => Math.max(0, (Number(cashTendered) || 0) - total),
    [cashTendered, total]
  );

  const addToCart = async (product) => {
    if (product.category === "Package" && mode === "Now") {
      alert(
        "Kailangan ng lead time ng mga Package kapag nag-Now order. Piliin ang Pre-Order."
      );
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price) || 0,
          image: product.image,
          details: product.details || [],
          stock: product.stock ?? "Available",
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const handleCompleteOrder = async () => {
    if (!cart.length) return;

    // 1. Validation
    if (mode === "Pre-Order" && (!customerName || !pickupDate)) {
      alert("Please fill in Customer Name and Pick-up Date for Pre-Orders.");
      return;
    }

    // 2. Prepare Payload
    const payload = {
      order_type: mode === "Pre-Order" ? "Pre-Order" : "Buy Now",
      status: "Confirmed",
      customer_name: customerName || "Walk-in",
      phone_number: phoneNumber || null,
      pickup_date: pickupDate || null,
      pickup_time: pickupTime || null,
      subtotal,
      additional_charge: additional,
      discount,
      grand_total: total,
      payment_type: "cash",
      amount_paid: Number(cashTendered) || total,
      change_due: changeDue,
      items: cart.map((it) => ({
        product_id: it.id,
        product_name: it.name,
        quantity: it.quantity,
        unit_price: it.price,
        total_price: it.price * it.quantity,
      })),
    };

    try {
      // 3. Send Order to Backend
      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body?.message || "Failed to save order.");
      }

      // 4. Reset UI State & Close Modal
      setShowReviewModal(false);
      setCashTendered("");
      setCart([]);
      setAdditional(0);
      setDiscount(0);
      setCustomerName("");
      setPhoneNumber("");
      setPickupDate("");
      setPickupTime("");

    } catch (err) {
      console.error("Order error:", err);
      alert(err.message || "Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F4] text-[#2B1C16] font-sans antialiased">
      {pageError && (
        <div className="p-6 max-w-3xl mx-auto" role="alert">
          <div className="bg-white border border-[#F0DFDA] rounded-2xl p-4">
            <h2 className="text-lg font-bold mb-2">POS failed to load</h2>
            <p className="text-sm text-[#6f5148]">{pageError}</p>
            <p className="text-xs text-gray-500 mt-2">
              Tip: check backend URL in VITE_API_BASE_URL and browser console.
            </p>
          </div>
        </div>
      )}

      <main>
        <div className="w-full flex flex-wrap lg:flex-nowrap gap-[22px] items-start p-4">
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap sm:flex-nowrap gap-[14px] items-center mb-5">
              <div className="w-full sm:w-auto sm:flex-shrink-0 sm:max-w-[280px]">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>

              <div className="w-full sm:flex-1 sm:min-w-0">
                <CategoryFilter
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
            </div>

            <ProductCards products={filteredProducts} onAddToCart={addToCart} />
          </div>

          <div className="w-full lg:w-[440px] lg:flex-shrink-0">
            <div className="bg-white border border-[#F0DFDA] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-134px)] lg:fixed lg:top-[112px] lg:right-[22px] lg:w-[440px] lg:z-30">
              <div className="p-4 border-b border-[#F0DFDA]">
                <div className="flex bg-[#FBEAE6] rounded-full p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setMode("Now")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      mode === "Now"
                        ? "bg-[#3D2A22] text-white"
                        : "text-[#8d6459]"
                    }`}
                  >
                    <Clock size={16} />
                    Order Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("Pre-Order")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      mode === "Pre-Order"
                        ? "bg-[#3D2A22] text-white"
                        : "text-[#8d6459]"
                    }`}
                  >
                    <Calendar size={16} />
                    Pre-Order
                  </button>
                </div>
              </div>

              {mode === "Pre-Order" && (
                <div className="border-b border-[#F0DFDA]">
                  <button
                    type="button"
                    onClick={() => setShowCustomerDetails((prev) => !prev)}
                    className="w-full flex items-center gap-2 px-5 py-4"
                  >
                    <User size={15} className="text-[#8d6459]" />
                    <span className="text-xs font-extrabold tracking-[.4px] text-[#8d6459] uppercase">
                      Customer Details
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      · Required
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-auto w-4 h-4 text-[#8d6459] transition-transform ${
                        showCustomerDetails ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showCustomerDetails && (
                    <div className="px-5 pb-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                        />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Customer Name *"
                          className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[#8d6459] mb-1">
                            Pick-up Date *
                          </label>
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[#8d6459] mb-1">
                            Pick-up Time
                          </label>
                          <input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 border-b border-[#F0DFDA]">
                <h2 className="text-[19px] font-extrabold">Current Order</h2>
                <div className="text-sm text-[#6f5148] mt-2">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <OrderSidebar
                  cart={cart}
                  subtotal={subtotal}
                  additional={additional}
                  setAdditional={setAdditional}
                  discount={discount}
                  setDiscount={setDiscount}
                  total={total}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  onCompleteOrder={() => setShowReviewModal(true)}
                  completeLabel={
                    mode === "Pre-Order"
                      ? "Confirm Pre-Order"
                      : "Complete Order"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Review Order & Cash Tendered Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-[#F0DFDA]">
            <h2 className="text-xl font-bold mb-4 text-[#2B1C16]">Review Order</h2>

            <div className="space-y-2 mb-4 text-sm text-[#6f5148]">
              <p><strong>Order Type:</strong> {mode === "Pre-Order" ? "Pre-Order" : "Buy Now"}</p>
              <p><strong>Payment Type:</strong> Cash</p>
              {customerName && <p><strong>Customer:</strong> {customerName}</p>}

              <div className="border-t border-b border-[#F0DFDA] py-2 my-2 max-h-40 overflow-y-auto">
                <strong className="block mb-1 text-[#2B1C16]">Ordered Items:</strong>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs py-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-base text-[#2B1C16] pt-1">
                <span>Grand Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Cash Tendered Input */}
            <div className="mb-4">
              <label className="block text-xs font-extrabold uppercase tracking-wide text-[#8d6459] mb-1">
                Cash Tendered
              </label>
              <input
                type="number"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="Enter cash amount"
                className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-lg font-bold text-[#2B1C16] focus:outline-none focus:ring-2 focus:ring-[#3D2A22]"
                autoFocus
              />
            </div>

            {/* Change Due Display */}
            <div className="mb-6 flex justify-between items-center bg-[#FAF5F4] p-3 rounded-xl border border-[#F0DFDA]">
              <span className="font-semibold text-sm text-[#8d6459]">Change Due:</span>
              <span className="text-xl font-extrabold text-green-600">
                ₱{changeDue.toFixed(2)}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setCashTendered("");
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={(Number(cashTendered) || 0) < total}
                onClick={handleCompleteOrder}
                className="px-4 py-2.5 bg-[#3D2A22] text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalize Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}