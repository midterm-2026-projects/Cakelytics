import React from "react";

export const defaultProductFormState = (product = {}) => ({
  name: product?.name ?? "",
  category: product?.category ?? "",
  description: product?.description ?? "",
  price: product?.price ?? "",
  limit: product?.limit ?? "",
});

export default function ProductFormFields({ form, setForm }) {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block md:col-span-2">
        <span className="text-sm font-semibold text-[#2C1F1C]">Product Name</span>
        <input
          aria-label="Product Name"
          value={form.name}
          onChange={handleChange("name")}
          className="mt-1 w-full rounded-lg border border-[#E8D5D1] px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[#2C1F1C]">Category</span>
        <input
          aria-label="Category"
          value={form.category}
          onChange={handleChange("category")}
          className="mt-1 w-full rounded-lg border border-[#E8D5D1] px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[#2C1F1C]">Price</span>
        <input
          aria-label="Price"
          type="number"
          value={form.price}
          onChange={handleChange("price")}
          className="mt-1 w-full rounded-lg border border-[#E8D5D1] px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="text-sm font-semibold text-[#2C1F1C]">Description</span>
        <textarea
          aria-label="Description"
          value={form.description}
          onChange={handleChange("description")}
          className="mt-1 min-h-[96px] w-full rounded-lg border border-[#E8D5D1] px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="text-sm font-semibold text-[#2C1F1C]">Limit</span>
        <input
          aria-label="Limit"
          value={form.limit}
          onChange={handleChange("limit")}
          className="mt-1 w-full rounded-lg border border-[#E8D5D1] px-3 py-2 text-sm outline-none"
        />
      </label>
    </div>
  );
}
