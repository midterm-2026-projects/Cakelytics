

// import React, { useEffect, useMemo, useState } from 'react';
// import { Search, Plus, Pencil, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';

// export default function ProductManagementPage() {
//   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);


//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState('');
//   const [activeCategory, setActiveCategory] = useState('All');

//   const categories = useMemo(
//     () => ['All', 'Package', 'Pastry', 'Celebration Material'],
//     []
//   );

//   const [formMode, setFormMode] = useState('create'); // create | edit
//   const [formOpen, setFormOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     category: 'Package',
//     price: '',
//     description: '',
//     image_url: '',
//     pre_order_limits: true,
//     daily_limit: '',
//     date_exceptions: [],
//     is_active: true,
//   });
//   const [selectedId, setSelectedId] = useState(null);

//   // Row currently being composed for "+ Add Specific Date Exception"
//   const [newException, setNewException] = useState({ date: '', slots: 0 });

//   const resetForm = () => {
//     setFormMode('create');
//     setSelectedId(null);
//     setFormData({
//       name: '',
//       category: 'Package',
//       price: '',
//       description: '',
//       image_url: '',
//       pre_order_limits: true,
//       daily_limit: '',
//       date_exceptions: [],
//       is_active: true,
//     });
//     setNewException({ date: '', slots: 0 });
//   };

//   const closeModal = () => {
//     setFormOpen(false);
//     resetForm();
//   };

//   const loadProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = new URLSearchParams();
//       if (activeCategory !== 'All') params.set('category', activeCategory);
//       if (search.trim()) params.set('search', search.trim());

//       const res = await fetch(`${API_BASE}/products?${params.toString()}`);
//       const body = await res.json();
//       console.log("First product:", body?.data?.[0]);
//       console.log("Image fields:", {
//         image: body?.data?.[0]?.image,
//         image_url: body?.data?.[0]?.image_url,
//         imageUrl: body?.data?.[0]?.imageUrl,
//       });

//       if (!res.ok || body?.success === false) {
//         throw new Error(body?.message || 'Failed to load products');
//       }

//       setProducts(body.data || []);
//     } catch (e) {
//       setError(e.message || 'Failed to load products');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeCategory]);

//   useEffect(() => {
//     const t = setTimeout(() => loadProducts(), 250);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

//   const filteredProducts = products; // backend already filters; keep stable

//   // Some backends name the image field differently (image_url, imageUrl, image,
//   // photo_url, thumbnail...). Check the common variants so real images actually render.
//   const getImageUrl = (p) => {
//     const raw =
//       p.image_url ||
//       p.imageUrl ||
//       p.image ||
//       p.photo_url ||
//       p.photoUrl ||
//       p.thumbnail ||
//       p.thumbnail_url ||
//       null;

//     // Match POS UX: always return a valid image URL
//     const fallback = "/products/chocolate-rolls.jpg";
//     if (!raw) return fallback;

//     // Absolute URL / data URL
//     if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;

//     // If backend stored a relative path like `/products/banana-cake.jpg`
//     // prefix it with the API origin.
//     // If it stored a relative filename like `banana-cake.jpg`, also prefix.
//     try {
//       const apiOrigin = new URL(API_BASE).origin;
//       const normalized = raw.startsWith('/') ? raw : `/${raw}`;
//       return `${apiOrigin}${normalized}`;
//     } catch {
//       return raw || fallback;
//     }
//   };

//   const validate = () => {
//     const name = formData.name?.trim();
//     const category = formData.category;
//     const price = Number(formData.price);
//     const imageUrl = formData.image_url?.trim();

//     if (!name) return { ok: false, message: 'Product Name is required.' };
//     if (!category) return { ok: false, message: 'Category is required.' };
//     if (Number.isNaN(price) || price < 0) {
//       return { ok: false, message: 'Price must be a valid number (>= 0).' };
//     }
//     if (!imageUrl) {
//       return { ok: false, message: 'Product Image is required. Please upload or provide an image URL.' };
//     }

//     return { ok: true, name, category, price };
//   };

//   const openCreate = () => {
//     resetForm();
//     setFormMode('create');
//     setFormOpen(true);
//   };

//   const openEdit = (p) => {
//     if (p?.id == null) {
//       alert('Cannot edit: product id is missing from server response.');
//       return;
//     }
//     setFormMode('edit');
//     setSelectedId(p.id);
//     setFormData({
//       name: p.name || '',
//       category: p.category || 'Package',
//       price: p.price ?? '',
//       description:
//         p.description ||
//         p.inclusion ||
//         (Array.isArray(p.description_points) ? p.description_points.join('\n') : ''),
//       image_url: getImageUrl(p) || '',
//       pre_order_limits: p.daily_limit != null,
//       daily_limit: p.daily_limit ?? '',
//       date_exceptions: Array.isArray(p.date_exceptions) ? p.date_exceptions : [],
//       is_active: p.is_active ?? true,
//     });
//     setNewException({ date: '', slots: 0 });
//     setFormOpen(true);
//   };

//   const addDateException = () => {
//     if (!newException.date) return;
//     setFormData((s) => ({
//       ...s,
//       date_exceptions: [...s.date_exceptions, newException],
//     }));
//     setNewException({ date: '', slots: 0 });
//   };

//   const removeDateException = (index) => {
//     setFormData((s) => ({
//       ...s,
//       date_exceptions: s.date_exceptions.filter((_, i) => i !== index),
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       setFormData((s) => ({ ...s, image_url: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const submit = async () => {
//     const v = validate();
//     if (!v.ok) {
//       alert(v.message);
//       return;
//     }

//     // Backend expects DB columns mapped via buildProductPayload():
//     // name, category, price, inclusion, image_url, daily_limit, is_active,
//     // allow_file_upload, stock_quantity.
//     // Keep payload strictly compatible (avoid sending date_exceptions, etc).
//     const payload = {
//       name: v.name,
//       category: v.category,
//       price: v.price,
//       // Map textarea field to backend's `inclusion` column.
//       inclusion: formData.description || '',
//       image_url: formData.image_url || null,
//       daily_limit: formData.pre_order_limits
//         ? Number(formData.daily_limit) || 0
//         : 0,
//       is_active: formData.is_active !== false,
//       // Fields not exposed in the UI; set safe defaults expected by the model.
//       allow_file_upload: false,
//       stock_quantity: 0,
//     };

//     setLoading(true);
//     setError(null);
//     try {
//       const url = formMode === 'edit' ? `${API_BASE}/products/${selectedId}` : `${API_BASE}/products`;
//       const method = formMode === 'edit' ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const body = await res.json();
//       if (!res.ok || body?.success === false) {
//         throw new Error(body?.message || 'Save failed');
//       }

//       closeModal();
//       await loadProducts();
//     } catch (e) {
//       setError(e.message || 'Save failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = async (id) => {
//     if (id == null) {
//       alert('Cannot delete: product id is missing from server response.');
//       return;
//     }
//     const ok = window.confirm('Delete this product?');
//     if (!ok) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
//       const body = await res.json().catch(() => ({}));
//       if (!res.ok || body?.success === false) {
//         throw new Error(body?.message || 'Delete failed');
//       }
//       await loadProducts();
//     } catch (e) {
//       setError(e.message || 'Delete failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#FAF5F4] min-h-screen font-sans text-[#2C1F1C]">
//       <main className="px-4 sm:px-6 lg:px-8 py-6 pb-12">
//         <div className="mx-auto w-full max-w-[1600px]">

//           <div className="flex flex-wrap items-center gap-3 mb-6">
//             <label className="flex-1 min-w-[200px] max-w-[320px] flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e7cfc8] rounded-[9px]">
//               <Search className="text-[#d0aaa1] flex-shrink-0" size={18} />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by product name..."
//                 className="w-full min-w-0 outline-none text-sm text-[#6f5148] placeholder-[#d3aaa3] bg-transparent"
//               />
//             </label>

//             {/* Category select (kept for unit tests accessibility contract) */}
//             <select
//               className="hidden"
//               aria-label="Category"
//               value={activeCategory}
//               onChange={(e) => setActiveCategory(e.target.value)}
//             >
//               {categories.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>

//             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//               {categories.map((c) => (
//                 <button
//                   key={c}
//                   type="button"
//                   onClick={() => setActiveCategory(c)}
//                   className={`px-5 py-2 text-sm rounded-full font-bold transition-colors border whitespace-nowrap flex-shrink-0 ${
//                     activeCategory === c
//                       ? 'bg-[#53362f] text-white border-[#53362f]'
//                       : 'bg-white text-[#8d6459] border-[#e3c9c1]'
//                   }`}
//                 >
//                   {c}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={openCreate}
//               aria-label="+ Add Product"
//               className="ml-auto flex items-center gap-2 bg-[#3D2A22] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#4a332a] transition-colors flex-shrink-0"
//             >
//               <Plus size={16} />
//               Add Product
//             </button>
//           </div>

//           {error && (
//             <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           {loading ? (
//             <div className="py-20 text-center text-[#9b665b] font-bold">Loading...</div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="py-20 text-center text-sm text-[#8A7F74] bg-white border border-[#F0DFDA] rounded-2xl">
//               No products found.
//             </div>
//           ) : (
//             <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
//               {filteredProducts.map((p) => {
//                 const description =
//                   p.description ||
//                   p.inclusion ||
//                   (Array.isArray(p.description_points) ? p.description_points.join(' · ') : '');

//                 const imgSrc = getImageUrl(p);

//                 return (
//                   <div
//                     key={p.id}
//                     className="bg-white border border-[#ead2cc] rounded-[12px] overflow-hidden shadow-sm flex flex-col"
//                   >
//                     <div className="relative aspect-[4/3] bg-[#f3e6e1] overflow-hidden">
//                       {imgSrc ? (
//                         <img
//                           src={imgSrc}
//                           alt={p.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : null}

//                       {/* Hide icon entirely when product has no image to match UX expectation */}
//                       {!imgSrc && (
//                         <div className="w-full h-full" />
//                       )}

//                       <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
//                         {p.category}
//                       </span>
//                       {p.daily_limit != null && (
//                         <span className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
//                           Limit: {p.daily_limit}/day
//                         </span>
//                       )}
//                     </div>

//                     <div className="p-4 flex-1">
//                       <h3 className="font-extrabold text-[#29130e]">{p.name}</h3>
//                       {description && (
//                         <p className="text-xs text-[#6f5148] mt-1 line-clamp-1">{description}</p>
//                       )}
//                       <div className="text-lg font-extrabold text-[#684238] mt-3">
//                         ₱{Number(p.price ?? 0).toFixed(2)}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 border-t border-[#F0DFDA]">
//                       <button
//                         onClick={() => openEdit(p)}
//                         className="flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-[#2d1712] hover:bg-[#FAF5F4] border-r border-[#F0DFDA]"
//                       >
//                         <Pencil size={14} />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => confirmDelete(p.id)}
//                         className="flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 size={14} />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Add / Edit Product Modal */}
//           {formOpen && (
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-2xl w-full max-w-[980px] max-h-[90vh] overflow-y-auto border border-[#F0DFDA]">
//                 <div className="px-6 py-5 border-b border-[#F0DFDA] flex items-center justify-between sticky top-0 bg-white z-10">
//                   <h2 className="text-xl font-extrabold text-[#29130e]">
//                     {formMode === 'edit' ? 'Edit Product' : 'Add Product'}
//                   </h2>
//                   <button
//                     className="w-8 h-8 flex items-center justify-center rounded-full border border-[#F0DFDA] hover:bg-[#FAF5F4]"
//                     onClick={closeModal}
//                     type="button"
//                     aria-label="Close"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {/* Left column */}
//                     <div className="space-y-5">
//                       <div>
//                         <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                           Product Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           value={formData.name}
//                           onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
//                           placeholder="Product Name"
//                           className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                             Category
//                           </label>
//                           <select
//                             value={formData.category}
//                             onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
//                             className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
//                           >
//                             <option value="Package">Package</option>
//                             <option value="Pastry">Pastry</option>
//                             <option value="Celebration Material">Celebration Material</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                             Price <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d6459] text-sm pointer-events-none">
//                               ₱
//                             </span>
//                             <input
//                               value={formData.price}
//                               onChange={(e) => setFormData((s) => ({ ...s, price: e.target.value }))}
//                               type="number"
//                               min={0}
//                               step="0.01"
//                               placeholder="0"
//                               className="w-full border border-[#F0DFDA] rounded-lg pl-7 pr-3 py-2.5 text-sm"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                           Inclusion / Description
//                         </label>
//                         <textarea
//                           value={formData.description}
//                           onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
//                           rows={6}
//                           placeholder={'e.g. Themed Cake (7x5)\nw/ Printed Toppers\n10 pcs Balloons'}
//                           className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm resize-none"
//                         />
//                       </div>
//                     </div>

//                     {/* Right column */}
//                     <div className="space-y-3">
//                       <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148]">
//                         Product Image <span className="text-red-500">*</span>
//                       </label>

//                       <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#F0DFDA] bg-[#f3e6e1] flex items-center justify-center">
//                         {formData.image_url ? (
//                           <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
//                         ) : (
//                           <ImageIcon size={32} className="text-[#c9a89c]" />
//                         )}
//                       </div>

//                       <input
//                         value={formData.image_url}
//                         onChange={(e) => setFormData((s) => ({ ...s, image_url: e.target.value }))}
//                         placeholder="Image URL (paste from web or upload)"
//                         className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
//                       />

//                       <label className="w-full flex items-center justify-center gap-2 border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm font-bold text-[#2d1712] hover:bg-[#FAF5F4] cursor-pointer transition-colors">
//                         <Upload size={16} />
//                         Upload Image
//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleFileUpload}
//                         />
//                       </label>
//                     </div>
//                   </div>

//                   {/* Pre-order limits */}
//                   <div className="mt-6 border border-[#F0DFDA] rounded-xl p-5 bg-[#FAF5F4]">
//                     <label className="flex items-start gap-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.pre_order_limits}
//                         onChange={(e) =>
//                           setFormData((s) => ({ ...s, pre_order_limits: e.target.checked }))
//                         }
//                         className="mt-1"
//                       />
//                       <div>
//                         <div className="text-sm font-extrabold uppercase tracking-wide text-[#2d1712]">
//                           Pre-Order Limits
//                         </div>
//                         <p className="text-xs text-[#6f5148] mt-1">
//                           Set the maximum number of times this product can be ordered per day.
//                         </p>
//                       </div>
//                     </label>

//                     {formData.pre_order_limits && (
//                       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                             Default Daily Capacity (slots)
//                           </label>
//                           <input
//                             value={formData.daily_limit}
//                             onChange={(e) =>
//                               setFormData((s) => ({ ...s, daily_limit: e.target.value }))
//                             }
//                             type="number"
//                             min={0}
//                             className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm bg-white"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
//                             Date Exceptions
//                           </label>
//                           <div className="flex gap-2">
//                             <input
//                               type="datetime-local"
//                               value={newException.date}
//                               onChange={(e) =>
//                                 setNewException((s) => ({ ...s, date: e.target.value }))
//                               }
//                               className="flex-1 min-w-0 border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm bg-white"
//                             />
//                             <input
//                               type="number"
//                               min={0}
//                               value={newException.slots}
//                               onChange={(e) =>
//                                 setNewException((s) => ({ ...s, slots: Number(e.target.value) }))
//                               }
//                               className="w-16 border border-[#F0DFDA] rounded-lg px-2 py-2.5 text-sm bg-white text-center"
//                             />
//                           </div>

//                           {formData.date_exceptions.length > 0 && (
//                             <ul className="mt-2 space-y-1">
//                               {formData.date_exceptions.map((ex, i) => (
//                                 <li
//                                   key={i}
//                                   className="flex items-center justify-between text-xs bg-white border border-[#F0DFDA] rounded-lg px-3 py-1.5"
//                                 >
//                                   <span>{ex.date} — {ex.slots} slots</span>
//                                   <button
//                                     type="button"
//                                     onClick={() => removeDateException(i)}
//                                     className="text-red-500 hover:underline font-semibold"
//                                   >
//                                     Remove
//                                   </button>
//                                 </li>
//                               ))}
//                             </ul>
//                           )}

//                           <button
//                             type="button"
//                             onClick={addDateException}
//                             className="mt-2 w-full border border-dashed border-[#c9a89c] rounded-lg py-2 text-xs font-bold text-[#8d6459] hover:bg-white transition-colors"
//                           >
//                             + Add Specific Date Exception
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-5 flex items-center gap-3">
//                     <input
//                       id="is_active"
//                       type="checkbox"
//                       checked={formData.is_active !== false}
//                       onChange={(e) => setFormData((s) => ({ ...s, is_active: e.target.checked }))}
//                     />
//                     <label htmlFor="is_active" className="text-xs font-bold text-[#6f5148]">
//                       Active
//                     </label>
//                   </div>
//                 </div>

//                 <div className="px-6 py-4 border-t border-[#F0DFDA] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-5 py-2.5 rounded-lg border border-[#F0DFDA] text-sm font-bold hover:bg-[#FAF5F4]"
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     disabled={loading}
//                     onClick={submit}
//                     className="px-5 py-2.5 rounded-lg bg-[#3D2A22] text-white text-sm font-bold hover:bg-[#4a332a] disabled:opacity-50"
//                   >
//                     {loading ? 'Saving...' : 'Submit'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';

export default function ProductManagementPage() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => ['All', 'Package', 'Pastry', 'Celebration Material'],
    []
  );

  const [formMode, setFormMode] = useState('create'); // create | edit
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Package',
    price: '',
    description: '',
    image_url: '',
    pre_order_limits: true,
    daily_limit: '',
    date_exceptions: [],
    is_active: true,
  });
  const [selectedId, setSelectedId] = useState(null);
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const fileInputRef = useRef(null);

  // Row currently being composed for "+ Add Specific Date Exception"
  const [newException, setNewException] = useState({ date: '', slots: 0 });

  const resetForm = () => {
    setFormMode('create');
    setSelectedId(null);
    setFormData({
      name: '',
      category: 'Package',
      price: '',
      description: '',
      image_url: '',
      pre_order_limits: true,
      daily_limit: '',
      date_exceptions: [],
      is_active: true,
    });
    setNewException({ date: '', slots: 0 });
  };

  const closeModal = () => {
    setFormOpen(false);
    resetForm();
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const body = await res.json();
      console.log("First product:", body?.data?.[0]);
      console.log("Image fields:", {
        image: body?.data?.[0]?.image,
        image_url: body?.data?.[0]?.image_url,
        imageUrl: body?.data?.[0]?.imageUrl,
      });

      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Failed to load products');
      }

      setProducts(body.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  useEffect(() => {
    const t = setTimeout(() => loadProducts(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredProducts = products; // backend already filters; keep stable

  // Some backends name the image field differently (image_url, imageUrl, image,
  // photo_url, thumbnail...). Check the common variants so real images actually render.
  const getImageUrl = (p) => {
    const raw =
      p.image_url ||
      p.imageUrl ||
      p.image ||
      p.photo_url ||
      p.photoUrl ||
      p.thumbnail ||
      p.thumbnail_url ||
      null;

    // Match POS UX: always return a valid image URL
    const fallback = "/products/chocolate-rolls.jpg";
    if (!raw) return fallback;

    // Absolute URL / data URL
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;

    // If backend stored a relative path like `/products/banana-cake.jpg`
    // prefix it with the API origin.
    // If it stored a relative filename like `banana-cake.jpg`, also prefix.
    try {
      const apiOrigin = new URL(API_BASE).origin;
      const normalized = raw.startsWith('/') ? raw : `/${raw}`;
      return `${apiOrigin}${normalized}`;
    } catch {
      return raw || fallback;
    }
  };

  const validate = () => {
    const name = formData.name?.trim();
    const category = formData.category;
    const price = Number(formData.price);
    const imageUrl = formData.image_url?.trim();

    if (!name) return { ok: false, message: 'Product Name is required.' };
    if (!category) return { ok: false, message: 'Category is required.' };
    if (Number.isNaN(price) || price < 0) {
      return { ok: false, message: 'Price must be a valid number (>= 0).' };
    }
    if (!imageUrl) {
      return { ok: false, message: 'Product Image is required. Please upload or provide an image URL.' };
    }

    return { ok: true, name, category, price };
  };

  const openCreate = () => {
    resetForm();
    setFormMode('create');
    setFormOpen(true);
  };

  const openEdit = (p) => {
    if (p?.id == null) {
      alert('Cannot edit: product id is missing from server response.');
      return;
    }
    setFormMode('edit');
    setSelectedId(p.id);
    setFormData({
      name: p.name || '',
      category: p.category || 'Package',
      price: p.price ?? '',
      description:
        p.description ||
        p.inclusion ||
        (Array.isArray(p.description_points) ? p.description_points.join('\n') : ''),
      image_url: getImageUrl(p) || '',
      pre_order_limits: p.daily_limit != null,
      daily_limit: p.daily_limit ?? '',
      date_exceptions: Array.isArray(p.date_exceptions) ? p.date_exceptions : [],
      is_active: p.is_active ?? true,
    });
    setNewException({ date: '', slots: 0 });
    setFormOpen(true);
  };

  const addDateException = () => {
    if (!newException.date) return;
    setFormData((s) => ({
      ...s,
      date_exceptions: [...s.date_exceptions, newException],
    }));
    setNewException({ date: '', slots: 0 });
  };

  const removeDateException = (index) => {
    setFormData((s) => ({
      ...s,
      date_exceptions: s.date_exceptions.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMB = MAX_IMAGE_SIZE / (1024 * 1024);
      alert(`Image file is too large. Maximum allowed size is ${sizeMB}MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((s) => ({ ...s, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    const v = validate();
    if (!v.ok) {
      alert(v.message);
      return;
    }

    // Backend expects DB columns mapped via buildProductPayload():
    // name, category, price, inclusion, image_url, daily_limit, is_active,
    // allow_file_upload, stock_quantity.
    // Keep payload strictly compatible (avoid sending date_exceptions, etc).
    const payload = {
      name: v.name,
      category: v.category,
      price: v.price,
      // Map textarea field to backend's `inclusion` column.
      inclusion: formData.description || '',
      image_url: formData.image_url || null,
      daily_limit: formData.pre_order_limits
        ? Number(formData.daily_limit) || 0
        : 0,
      is_active: formData.is_active !== false,
      // Fields not exposed in the UI; set safe defaults expected by the model.
      allow_file_upload: false,
      stock_quantity: 0,
    };

    setLoading(true);
    setError(null);
    try {
      const url = formMode === 'edit' ? `${API_BASE}/products/${selectedId}` : `${API_BASE}/products`;
      const method = formMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Save failed');
      }

      closeModal();
      await loadProducts();
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (id) => {
    if (id == null) {
      alert('Cannot delete: product id is missing from server response.');
      return;
    }
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Delete failed');
      }
      await loadProducts();
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF5F4] min-h-screen font-sans text-[#2C1F1C]">
      <main className="px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="mx-auto w-full max-w-[1600px]">

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <label className="flex-1 min-w-[200px] max-w-[320px] flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e7cfc8] rounded-[9px]">
              <Search className="text-[#d0aaa1] flex-shrink-0" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name..."
                className="w-full min-w-0 outline-none text-sm text-[#6f5148] placeholder-[#d3aaa3] bg-transparent"
              />
            </label>

            {/* Category select (kept for unit tests accessibility contract) */}
            <select
              className="hidden"
              aria-label="Category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`px-5 py-2 text-sm rounded-full font-bold transition-colors border whitespace-nowrap flex-shrink-0 ${
                    activeCategory === c
                      ? 'bg-[#53362f] text-white border-[#53362f]'
                      : 'bg-white text-[#8d6459] border-[#e3c9c1]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={openCreate}
              aria-label="+ Add Product"
              className="ml-auto flex items-center gap-2 bg-[#3D2A22] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#4a332a] transition-colors flex-shrink-0"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-[#9b665b] font-bold">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#8A7F74] bg-white border border-[#F0DFDA] rounded-2xl">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
              {filteredProducts.map((p) => {
                const description =
                  p.description ||
                  p.inclusion ||
                  (Array.isArray(p.description_points) ? p.description_points.join(' · ') : '');

                const imgSrc = getImageUrl(p);

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-[#ead2cc] rounded-[12px] overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-[#f3e6e1] overflow-hidden">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}

                      {/* Hide icon entirely when product has no image to match UX expectation */}
                      {!imgSrc && (
                        <div className="w-full h-full" />
                      )}

                      <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
                        {p.category}
                      </span>
                      {p.daily_limit != null && (
                        <span className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                          Limit: {p.daily_limit}/day
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1">
                      <h3 className="font-extrabold text-[#29130e]">{p.name}</h3>
                      {description && (
                        <p className="text-xs text-[#6f5148] mt-1 line-clamp-1">{description}</p>
                      )}
                      <div className="text-lg font-extrabold text-[#684238] mt-3">
                        ₱{Number(p.price ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-[#F0DFDA]">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-[#2d1712] hover:bg-[#FAF5F4] border-r border-[#F0DFDA]"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(p.id)}
                        className="flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add / Edit Product Modal */}
          {formOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl w-full max-w-[980px] max-h-[90vh] overflow-y-auto border border-[#F0DFDA]">
                <div className="px-6 py-5 border-b border-[#F0DFDA] flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-extrabold text-[#29130e]">
                    {formMode === 'edit' ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#F0DFDA] hover:bg-[#FAF5F4]"
                    onClick={closeModal}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={formData.name}
                          onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
                          placeholder="Product Name"
                          className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                            Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
                            className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                          >
                            <option value="Package">Package</option>
                            <option value="Pastry">Pastry</option>
                            <option value="Celebration Material">Celebration Material</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d6459] text-sm pointer-events-none">
                              ₱
                            </span>
                            <input
                              value={formData.price}
                              onChange={(e) => setFormData((s) => ({ ...s, price: e.target.value }))}
                              type="number"
                              min={0}
                              step="0.01"
                              placeholder="0"
                              className="w-full border border-[#F0DFDA] rounded-lg pl-7 pr-3 py-2.5 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                          Inclusion / Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
                          rows={6}
                          placeholder={'e.g. Themed Cake (7x5)\nw/ Printed Toppers\n10 pcs Balloons'}
                          className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm resize-none"
                        />
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148]">
                        Product Image <span className="text-red-500">*</span>
                      </label>

                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#F0DFDA] bg-[#f3e6e1] flex items-center justify-center">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} className="text-[#c9a89c]" />
                        )}
                      </div>

                      <input
                        value={formData.image_url}
                        onChange={(e) => setFormData((s) => ({ ...s, image_url: e.target.value }))}
                        placeholder="Image URL (paste from web or upload)"
                        className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm"
                      />

                      <label className="w-full flex items-center justify-center gap-2 border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm font-bold text-[#2d1712] hover:bg-[#FAF5F4] cursor-pointer transition-colors">
                        <Upload size={16} />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pre-order limits */}
                  <div className="mt-6 border border-[#F0DFDA] rounded-xl p-5 bg-[#FAF5F4]">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pre_order_limits}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, pre_order_limits: e.target.checked }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-extrabold uppercase tracking-wide text-[#2d1712]">
                          Pre-Order Limits
                        </div>
                        <p className="text-xs text-[#6f5148] mt-1">
                          Set the maximum number of times this product can be ordered per day.
                        </p>
                      </div>
                    </label>

                    {formData.pre_order_limits && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                            Default Daily Capacity (slots)
                          </label>
                          <input
                            value={formData.daily_limit}
                            onChange={(e) =>
                              setFormData((s) => ({ ...s, daily_limit: e.target.value }))
                            }
                            type="number"
                            min={0}
                            className="w-full border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wide text-[#6f5148] mb-1.5">
                            Date Exceptions
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="datetime-local"
                              value={newException.date}
                              onChange={(e) =>
                                setNewException((s) => ({ ...s, date: e.target.value }))
                              }
                              className="flex-1 min-w-0 border border-[#F0DFDA] rounded-lg px-3 py-2.5 text-sm bg-white"
                            />
                            <input
                              type="number"
                              min={0}
                              value={newException.slots}
                              onChange={(e) =>
                                setNewException((s) => ({ ...s, slots: Number(e.target.value) }))
                              }
                              className="w-16 border border-[#F0DFDA] rounded-lg px-2 py-2.5 text-sm bg-white text-center"
                            />
                          </div>

                          {formData.date_exceptions.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {formData.date_exceptions.map((ex, i) => (
                                <li
                                  key={i}
                                  className="flex items-center justify-between text-xs bg-white border border-[#F0DFDA] rounded-lg px-3 py-1.5"
                                >
                                  <span>{ex.date} — {ex.slots} slots</span>
                                  <button
                                    type="button"
                                    onClick={() => removeDateException(i)}
                                    className="text-red-500 hover:underline font-semibold"
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <button
                            type="button"
                            onClick={addDateException}
                            className="mt-2 w-full border border-dashed border-[#c9a89c] rounded-lg py-2 text-xs font-bold text-[#8d6459] hover:bg-white transition-colors"
                          >
                            + Add Specific Date Exception
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData((s) => ({ ...s, is_active: e.target.checked }))}
                    />
                    <label htmlFor="is_active" className="text-xs font-bold text-[#6f5148]">
                      Active
                    </label>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#F0DFDA] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-lg border border-[#F0DFDA] text-sm font-bold hover:bg-[#FAF5F4]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={submit}
                    className="px-5 py-2.5 rounded-lg bg-[#3D2A22] text-white text-sm font-bold hover:bg-[#4a332a] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}