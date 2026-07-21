

import React, { useState } from "react";
import { X } from "lucide-react";
import ProductFormFields, {
  defaultProductFormState,
} from "./ProductFormFields";

/**
 * UpdateProductModal
 * Opened by the "Edit" button on a ProductCard. Shows the order/product id
 * in the header and includes the Delete Product action.
 */
export function UpdateProductModal({ product, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(defaultProductFormState(product));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 shrink-0">
          <h2 className="text-xl font-bold text-[#2C1F1C] m-0">
            #{product?.orderId ?? "ORD-0000"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg border border-[#E8D5D1] flex items-center justify-center text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer bg-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-8 overflow-y-auto flex-1">
          <ProductFormFields form={form} setForm={setForm} />
        </div>

        {/* Footer — includes Delete Product on the left */}
        <div className="flex items-center justify-between gap-3 px-8 py-5 border-t border-[#F1ECEC] shrink-0">
          <button
            type="button"
            onClick={() => onDelete?.(product)}
            className="px-5 py-2.5 rounded-lg bg-[#FEF2F2] text-[#DC2626] text-sm font-semibold cursor-pointer hover:bg-[#FEE2E2]"
          >
            Delete Product
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#E8D5D1] bg-white text-sm font-semibold text-[#2C1F1C] cursor-pointer hover:bg-[#FAF5F4]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onSave?.(form)}
              className="px-5 py-2.5 rounded-lg bg-[#4A3530] text-white text-sm font-semibold cursor-pointer hover:bg-[#3D2B27]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
