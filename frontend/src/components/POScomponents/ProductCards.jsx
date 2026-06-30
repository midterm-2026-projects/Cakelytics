// src/components/ProductCard.jsx
export default function ProductCard({ product, onAddToCart }) {
  const stockStatus = product.stock || "Available";

  return (
    <div className="bg-white border border-[#ead2cc] rounded-[12px] overflow-hidden shadow-sm">
      <div className="h-[150px] bg-cover bg-center" style={{ backgroundImage: `url("${product.image}")` }}>
        {/* Stock Badge */}
        <span className="bg-black text-white text-xs px-2 py-1 m-2 inline-block rounded">
          Stock: {stockStatus}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-[18px] font-black text-[#29130e]">{product.name}</h3>
        
        {/* I-map ang details/inclusions */}
        <ul className="text-sm text-gray-600 my-2 list-disc pl-4">
          {product.details && product.details.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-4">
          <strong className="text-[#684238]">₱{product.price.toLocaleString()}.00</strong>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-[#684238] text-white px-4 py-2 rounded-lg"
          >
            + ADD
          </button>
        </div>
      </div>
    </div>
  );
}