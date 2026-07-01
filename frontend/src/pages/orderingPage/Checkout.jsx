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
};

export default function Checkout() {
  const navigate = useNavigate();

  const [pickupType, setPickupType] = useState("pickup");
  const [paymentType, setPaymentType] = useState("deposit");
  const [formData, setFormData] = useState(INITIAL_FORM);

  // -----------------------------
  // SAFE CART PARSING
  // -----------------------------
  const cart = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  }, []);

  // -----------------------------
  // COMPUTED TOTAL
  // -----------------------------
  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  // -----------------------------
  // FORM HANDLER
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // VALIDATION (CLEAN & CENTRALIZED)
  // -----------------------------
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your Full Name.");
      return false;
    }

    if (!formData.contact.trim()) {
      alert("Please enter your Contact Number.");
      return false;
    }

    if (pickupType === "preorder") {
      if (!formData.date) {
        alert("Please select a pickup date.");
        return false;
      }

      if (!formData.time) {
        alert("Please select a pickup time.");
        return false;
      }
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return false;
    }

    return true;
  };

  // -----------------------------
  // SUBMIT ORDER
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const orderData = {
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,

      ...formData,
      pickupType,
      paymentType,

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),

      total,

      deposit:
        paymentType === "deposit" ? total * 0.5 : total,

      dateCreated: new Date().toLocaleString("en-PH", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    localStorage.removeItem("cart");

    navigate("/receipt");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <>
      <OrderProgress />

      <section className="bg-[#F8F6F3] min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">

          <h1 className="text-2xl font-bold text-[#4A1F00] mb-6">
            Checkout
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div>
              <h2 className="font-semibold mb-3">
                Pick-up & Customer Details
              </h2>

              {/* Toggle */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPickupType("pickup")}
                  className={`flex-1 py-2 rounded-lg border ${
                    pickupType === "pickup"
                      ? "bg-[#4A1F00] text-white"
                      : ""
                  }`}
                >
                  Pick up Now
                </button>

                <button
                  type="button"
                  onClick={() => setPickupType("preorder")}
                  className={`flex-1 py-2 rounded-lg border ${
                    pickupType === "preorder"
                      ? "bg-[#4A1F00] text-white"
                      : ""
                  }`}
                >
                  Pre-Order
                </button>
              </div>

              {pickupType === "preorder" && (
                <div className="grid gap-3 mb-3">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                </div>
              )}

              <input
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
              />

              <input
                name="contact"
                placeholder="Contact Number *"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
              />

              <input
                name="altContact"
                placeholder="Alternative Number (Optional)"
                value={formData.altContact}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* RIGHT */}
            <div>

              {/* ORDER SUMMARY */}
              <h2 className="font-semibold mb-3">
                Order Summary
              </h2>

              <div className="border p-4 rounded">
                {cart.length === 0 ? (
                  <p className="text-gray-500">
                    No items in cart.
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between mb-2"
                      >
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span>
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <hr className="my-3" />

                    <div className="flex justify-between font-bold">
                      <span>Grand Total</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* PAYMENT */}
              <h2 className="font-semibold mt-6 mb-3">
                Payment
              </h2>

              <div className="space-y-3">

                <div
                  onClick={() => setPaymentType("deposit")}
                  className={`border p-3 rounded cursor-pointer ${
                    paymentType === "deposit"
                      ? "border-[#4A1F00]"
                      : ""
                  }`}
                >
                  <p>₱{(total * 0.5).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Pay 50% deposit
                  </p>
                </div>

                <div
                  onClick={() => setPaymentType("full")}
                  className={`border p-3 rounded cursor-pointer ${
                    paymentType === "full"
                      ? "border-[#4A1F00]"
                      : ""
                  }`}
                >
                  <p>₱{total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Pay full amount
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className="text-[#4A1F00]"
                >
                  ← Back to Menu
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-[#4A1F00] text-white px-5 py-2 rounded"
                >
                  Place Order
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}