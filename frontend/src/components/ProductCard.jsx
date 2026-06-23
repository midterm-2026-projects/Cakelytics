export default function ProductCard({ product, addToCart }) {
  const stockStatus = product.stock || "Available";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-60 object-cover"
      />

      {/* Product Details */}
      <div className="p-5">

        <h3 className="text-xl font-semibold text-[#5A3B2E]">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.category}
        </p>

        <p className="text-2xl font-bold text-[#4A1F00] mt-3">
          ₱{Number(product.price).toFixed(2)}
        </p>

        <p className={`mt-2 font-medium ${
          stockStatus === "Available"
            ? "text-green-600"
            : "text-red-500"
        }`}>
          {stockStatus}
        </p>

        <button
          onClick={() => addToCart(product)}
          disabled={stockStatus !== "Available"}
          className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
            stockStatus === "Available"
              ? "bg-[#4A1F00] hover:bg-[#341500] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {stockStatus === "Available"
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

      </div>
    </div>
  );
}