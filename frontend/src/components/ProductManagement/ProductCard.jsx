import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export function ProductCard({ product, onEdit, onDelete }) {
  const { name, description, price, image, category, limit } = product;

  const formattedPrice = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return (
    <div className="bg-white rounded-[14px] border border-[#F1ECEB] overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-[#f2ede6]">
        <img src={image} alt={name} loading="lazy" className="w-full h-full object-cover block" />
        <span className="absolute top-2.5 left-2.5 bg-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full text-[#2C1F1C]">
          {category}
        </span>
        {limit && (
          <span className="absolute top-2.5 right-2.5 bg-[#3D2B27] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {limit}
          </span>
        )}
      </div>

      <div className="p-[16px] pb-1 flex-1">
        <h3 className="text-base font-bold m-0 mb-1 text-[#2C1F1C]">{name}</h3>
        <p className="text-edg text-[#6B4F48] m-0 mb-2.5 overflow-hidden text-ellipsis whitespace-nowrap" title={description}>
          {description}
        </p>
        <p className="text-[17px] font-bold m-0 mb-3.5 text-[#4A3530]">₱{formattedPrice}</p>
      </div>

      <div className="flex border-t border-[#F1ECEB]">
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-none border-none text-[13px] font-semibold cursor-pointer text-[#2C1F1C] border-r border-[#F1ECEB] hover:bg-[#FAF5F4] transition-colors" 
          onClick={() => onEdit?.(product)}
        >
          <Pencil size={14} />
          Edit
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-none border-none text-[13px] font-semibold cursor-pointer text-[#EF4444] hover:bg-[#FEECEC] transition-colors" 
          onClick={() => onDelete?.(product)}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}