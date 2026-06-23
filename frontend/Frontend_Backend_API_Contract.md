# 📚 Frontend & Backend Data Structure Guide (API Contract)

**Para sa lahat ng Devs (Pakibasa ng maigi):** Kapag gagawa kayo ng "Mock Data" sa mga Frontend Service files ninyo (halimbawa: `productService.js`, `orderService.js`), **DAPAT EKSAKTO ANG PANGALAN NG ATTRIBUTES** sa kung ano ang nasa backend database natin.[cite: 5]

Kung ang attribute sa database ay `stock_quantity`, huwag ninyong gagawing `stock` lang sa frontend. Mag-e-error ang buong system natin kapag pinatay na ang mock mode at kinonekta na sa totoong backend! Walang iimbento ng sariling pangalan ng data.[cite: 5]

---

## 🗄️ Database Schema (Ito ang mga EXACT attributes na gagamitin)

### 👤 Users & Admins
* **admins**: `id`, `name`, `email`, `created_at`[cite: 5]
* **customers**: `id`, `name`, `phone`, `alt_phone`, `facebook`, `email`, `created_at`[cite: 5]

### 🍰 Products & Packages
* **products**: `id`, `name`, `category`, `price`, `inclusion`, `image_url`, `daily_limit`, `is_active`, `allow_file_upload`, `created_at`, `updated_at`[cite: 5]
* **product_variants**: `id`, `product_id`, `label`, `price`[cite: 5]
* **product_date_exceptions**: `id`, `product_id`, `exception_date`, `reason`[cite: 5]

### 🛒 Orders
* **orders**: `id`, `order_number`, `customer_id`, `placed_by_admin`, `order_type`, `source`, `status`, `subtotal`, `additional_charge`, `discount`, `grand_total`, `payment_type`, `amount_paid`, `balance`, `pickup_date`, `pickup_time`, `special_instructions`, `customer_reference_url`, `paymongo_payment_id`, `created_at`, `updated_at`[cite: 5]
* **order_items**: `id`, `order_id`, `product_id`, `product_name`, `variant_label`, `quantity`, `unit_price`, `total_price`[cite: 5]

### 📦 Inventory & Materials
* **raw_ingredients**: `id`, `name`, `unit`, `stock_quantity`, `minimum_stock`, `cost_per_unit`, `updated_at`[cite: 5]
* **celebration_materials**: `id`, `name`, `unit`, `stock_quantity`, `minimum_stock`, `cost_per_unit`, `updated_at`[cite: 5]

### 🥣 Recipes & Production
* **recipes**: `id`, `product_id`, `yield_quantity`, `yield_unit`, `estimated_cost`, `created_at`, `updated_at`[cite: 5]
* **recipe_ingredients**: `id`, `recipe_id`, `item_type`, `item_name`, `quantity`, `unit`[cite: 5]
* **production_logs**: `id`, `recipe_id`, `product_id`, `product_name`, `batches`, `total_produced`, `yield_unit`, `notes`, `produced_at`[cite: 5]
* **production_deductions**: `id`, `production_log_id`, `item_type`, `item_name`, `quantity`, `unit`[cite: 5]
* **waste_logs**: `id`, `waste_type`, `item_name`, `quantity`, `unit`, `reason`, `notes`, `cost`, `logged_at`[cite: 5]

---

## 📌 Valid Values para sa mga ENUMS (Dropdowns / Status)
Kung maglalagay kayo ng status o type sa mock data, ito lang ang mga pwedeng ilagay:
* **order_status**: `'Confirmed'`, `'Ready'`, `'Completed'`, `'Cancelled'`[cite: 5]
* **order_type**: `'Pre-Order'`, `'Buy Now'`[cite: 5]
* **order_source**: `'online'`, `'walk-in'`[cite: 5]
* **payment_type**: `'full'`, `'deposit'`[cite: 5]
* **waste_type**: `'ingredient'`, `'material'`, `'product'`[cite: 5]
* **inv_item_type**: `'raw'`, `'material'`[cite: 5]
* **product_category**: `'Package'`, `'Pastry'`, `'Celebration Material'`[cite: 5]

---

## 💡 Halimbawa ng Tamang Mock Data sa Frontend Code

Kung gagawa kayo ng function sa Frontend para kunin ang products, ganito dapat ang itsura ng mock return data ninyo (kumpleto ang properties base sa schema sa taas):[cite: 5]

```javascript
// Halimbawa sa loob ng productService.js
export const getProducts = async () => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'mock-123', 
            name: 'Classic Vanilla Cake', 
            category: 'Pastry', 
            price: 850,
            inclusion: '1kg round cake', 
            image_url: null, 
            daily_limit: 5,
            is_active: true, 
            allow_file_upload: false, 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString()
          }
        ]);
      }, 500); // 500ms delay para ma-simulate ang loading sa browser
    });
  } else {
    // Totoong fetch papunta sa backend...
  }
};

---

Pangalawa, para makapag-simulate ka na agad sa browser gamit ang `npm run dev`, heto ang mga kailangan mong i-update sa files mo. Kopyahin mo na lang ito direkta.

### 1. Gumawa ka ng `.env` file
Kung wala pa, gumawa ka ng file na pangalan ay `.env` sa pinakalabas na folder ng frontend mo (katabi ng `package.json`). Ilagay ito sa loob:
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:4000/api