import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import OrderProgress from "../../components/orderingComponents/OrderProgress";

export default function Complete() {
  return (
    <>
      <OrderProgress />

      <section className="bg-[#F8F6F3] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">

          <CheckCircle
            size={80}
            className="text-green-600 mx-auto mb-6"
          />

          <h1 className="text-3xl font-bold text-[#4A1F00] mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-2">
            Thank you for choosing
          </p>

          <p className="font-semibold text-[#4A1F00] mb-6">
            Aileen and Niculus Bake Shop
          </p>

          <div className="bg-[#F8F6F3] rounded-lg p-4 text-left mb-6">
            <p>
              <strong>Status:</strong> Pending
            </p>

            <p>
              <strong>Payment:</strong> Waiting for Confirmation
            </p>

            <p>
              <strong>Pickup</strong> Please wait for our confirmation.
            </p>
          </div>

          <div className="flex gap-4">

            <Link
              to="/"
              className="flex-1 bg-[#4A1F00] text-white py-3 rounded-lg text-center hover:bg-[#341500] transition"
            >
              Back to Home
            </Link>

            <Link
              to="/menu"
              className="flex-1 border border-[#4A1F00] text-[#4A1F00] py-3 rounded-lg text-center hover:bg-[#F8F6F3] transition"
            >
              Order Again
            </Link>

          </div>

        </div>
      </section>
    </>
  );
}