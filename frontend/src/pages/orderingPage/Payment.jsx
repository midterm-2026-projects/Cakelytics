import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderProgress from "../../components/orderingComponents/OrderProgress";

export default function Payment() {
  const navigate = useNavigate();

  const customer = JSON.parse(
    localStorage.getItem("customerDetails")
  );

  const [paymentType, setPaymentType] = useState("deposit");
  

  const handlePlaceOrder = () => {
    localStorage.setItem("paymentType", paymentType);

    alert("Order placed successfully!");

    navigate("/complete");
  };

  return (
    <>
      <OrderProgress />

      <section className="bg-[#F8F6F3] min-h-screen py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-[#4A1F00] mb-6">
            Payment
          </h1>

          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">
              Customer Information
            </h2>

            <p><strong>Name:</strong> {customer?.name}</p>
            <p><strong>Contact:</strong> {customer?.contact}</p>
            <p><strong>Order Type:</strong> {customer?.orderType}</p>

            {customer?.orderType === "Delivery" && (
              <p>
                <strong>Address:</strong> {customer?.address}
              </p>
            )}
          </div>

          <h2 className="font-semibold mb-3">
            Select Payment
          </h2>

          <div className="space-y-3">

            <label className="flex items-center border rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="deposit"
                checked={paymentType === "deposit"}
                onChange={(e) =>
                  setPaymentType(e.target.value)
                }
                className="mr-3"
              />

              <div>
                <h3 className="font-semibold">
                  50% Deposit
                </h3>

                <p className="text-sm text-gray-500">
                  Pay half now and the remaining balance upon pickup.
                </p>
              </div>
            </label>

            <label className="flex items-center border rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="full"
                checked={paymentType === "full"}
                onChange={(e) =>
                  setPaymentType(e.target.value)
                }
                className="mr-3"
              />

              <div>
                <h3 className="font-semibold">
                  Full Payment
                </h3>

                <p className="text-sm text-gray-500">
                  Pay the full amount now.
                </p>
              </div>
            </label>

          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-8 bg-[#4A1F00] text-white py-3 rounded-lg hover:bg-[#341500]"
          >
            Place Order
          </button>

        </div>
      </section>
    </>
  );
}