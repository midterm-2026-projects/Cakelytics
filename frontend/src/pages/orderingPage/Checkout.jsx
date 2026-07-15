import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import OrderProgress from "../../components/orderingComponents/OrderProgress";
import axios from "axios";

const INITIAL_FORM = {
  name: "",
  contact: "",
  altContact: "",
  date: "",
  time: "",
  facebook: "",
  email: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const [pickupType, setPickupType] = useState("pickup");
  const [paymentType, setPaymentType] = useState("deposit");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; }
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { alert("Please enter your Full Name."); return false; }
    if (!formData.contact.trim()) { alert("Please enter your Contact Number."); return false; }
    if (pickupType === "preorder" && (!formData.date || !formData.time)) {
      alert("Please select both date and time for pre-order."); return false;
    }
    if (cart.length === 0) { alert("Your cart is empty."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);

    const unifiedPayload = {
      customer_name: formData.name,
      customer_phone: formData.contact,
      customer_alt_phone: formData.altContact || "",
      customer_facebook: formData.facebook || "",
      customer_email: formData.email || "",
      subtotal: total,
      grand_total: total,
      payment_type: paymentType,
      order_type: pickupType === "preorder" ? "Pre-Order" : "Buy Now",
      source: "online",
      pickup_date: pickupType === "pickup" ? new Date().toISOString().split('T')[0] : formData.date,
      pickup_time: pickupType === "pickup" ? new Date().toTimeString().split(' ')[0] : formData.time,
      
      cartItems: cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        unit_price: item.price,
        unitPrice: item.price,
        total_price: item.price * item.quantity,
      })),
    };

    try {
      const response = await axios.post("http://localhost:3000/api/orders/checkout", unifiedPayload);
      
      // Tinitiyak na true o successful ang response ng backend ninyo
      if (response.data && (response.data.success || response.data.order_no || response.data.id)) {
        // I-save ang kabuuang resulta kasama ang binalik na data ng Database
        localStorage.setItem("orderData", JSON.stringify({ ...response.data, ...formData, cartItems: cart }));
        localStorage.removeItem("cart"); // Linisin ang cart para sa susunod na order
        navigate("/receipt");
      } else {
        alert("Failed to process order details from server.");
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      if (error.response && error.response.data) {
        alert(`Backend Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        alert("Error processing checkout. Please try again.");
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <>
      <OrderProgress />

      <section className="bg-[#F8F6F3] min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          
          <h1 className="text-3xl font-bold text-[#4A1F00] mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: Pick-up & Customer Details */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-bold text-sm text-gray-800">
                Pick-up & Customer Details
              </h2>
              
              <div className="flex gap-3 mb-4">
                <button 
                  type="button" 
                  onClick={() => setPickupType("pickup")} 
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    pickupType === "pickup" ? "bg-[#4A1F00] text-white border-[#4A1F00]" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Pick up Now
                </button>
                <button 
                  type="button" 
                  onClick={() => setPickupType("preorder")} 
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    pickupType === "preorder" ? "bg-[#4A1F00] text-white border-[#4A1F00]" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Pre-Order
                </button>
              </div>

              {pickupType === "preorder" && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date}
                    onChange={handleChange} 
                    className="border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
                  />
                  <input 
                    type="time" 
                    name="time" 
                    value={formData.time}
                    onChange={handleChange} 
                    className="border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
                  />
                </div>
              )}

              <input 
                name="name" 
                type="text"
                placeholder="Full Name *" 
                value={formData.name}
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
              />
              <input 
                name="contact" 
                type="text"
                placeholder="Contact Number *" 
                value={formData.contact}
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
              />
              <input 
                name="facebook" 
                type="text"
                placeholder="Facebook Name (Optional)" 
                value={formData.facebook}
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email Address (Optional)" 
                value={formData.email}
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A1F00]" 
              />
            </div>

            {/* RIGHT SIDE: Order Summary & Payment */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="font-bold text-sm text-gray-800 mb-2">
                  Order Summary
                </h2>
                <div className="border border-gray-300 rounded-xl p-4 bg-white">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items in cart.</p>
                  ) : (
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-700">
                          <span>{item.quantity}× {item.name}</span>
                          <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <hr className="border-gray-200 my-3" />
                  <div className="flex justify-between font-bold text-base text-gray-900">
                    <span>Grand Total</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center bg-[#4A1F00] text-white rounded-full w-5 h-5 text-xs font-bold">
                    3
                  </span>
                  <h2 className="font-bold text-gray-800 text-sm">
                    Payment
                  </h2>
                </div>
                <p className="text-[11px] text-gray-500 pl-7 mb-3">
                  We require at least a 50% deposit to process your order.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
                  <div 
                    onClick={() => setPaymentType("deposit")} 
                    className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentType === "deposit"
                        ? "border-[#4A1F00] bg-[#4A1F00]/5 shadow-sm"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="deposit"
                      checked={paymentType === "deposit"}
                      onChange={() => setPaymentType("deposit")}
                      className="mt-0.5 accent-[#4A1F00] h-3.5 w-3.5"
                    />
                    <div className="flex flex-col justify-between h-24 w-full">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xs">
                          50% Deposit
                        </h3>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          Pay 50% deposit
                        </p>
                      </div>
                      <div className="text-xl font-extrabold text-[#4A1F00]">
                        ₱{(total * 0.5).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentType("full")} 
                    className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentType === "full"
                        ? "border-[#4A1F00] bg-[#4A1F00]/5 shadow-sm"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="full"
                      checked={paymentType === "full"}
                      onChange={() => setPaymentType("full")}
                      className="mt-0.5 accent-[#4A1F00] h-3.5 w-3.5"
                    />
                    <div className="flex flex-col justify-between h-24 w-full">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xs">
                          Full Payment
                        </h3>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          Pay full amount
                        </p>
                      </div>
                      <div className="text-xl font-extrabold text-[#4A1F00]">
                        ₱{total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 pl-7">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-xs font-semibold text-gray-500 hover:underline"
                >
                  &larr; Back to Menu
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#4A1F00] text-white px-8 py-2.5 rounded-xl hover:bg-[#341500] font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}