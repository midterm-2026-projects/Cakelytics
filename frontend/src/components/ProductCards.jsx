import { Package } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <article className="bg-white border border-[#ead2cc] rounded-[12px] overflow-hidden">
      {/* Card Image */}
      <div
        className="h-[120px] bg-cover bg-center relative"
        style={{ backgroundImage: `url("${product.image}")` }}
      >
        <span className="absolute bottom-3 left-3 bg-[#48342e]/90 text-white px-3 py-1 rounded-full text-[12px] font-extrabold flex items-center gap-1">
          <Package size={13} />
          Package
        </span>
      </div>

      {/* Card Body */}
      <div className="p-[15px_14px_16px]">
        <h3 className="text-[18px] font-black text-[#29130e] mb-1">
          {product.name}
        </h3>

        <strong className="text-[16px] text-[#684238] block mb-2">
          ₱{product.price.toLocaleString()}.00
        </strong>

        <ul className="pl-4 text-[#9b665b] text-[14px] leading-[1.55] list-disc">
          {product.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}