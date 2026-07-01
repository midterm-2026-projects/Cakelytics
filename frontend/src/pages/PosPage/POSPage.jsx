import { useMemo, useState } from "react";

import SearchBar from "../../components/POScomponents/SearchBar";
import CategoryFilters from "../../components/POScomponents/CategoryFilter";
import ProductCard from "../../components/POScomponents/ProductCards";
import OrderSidebar from "../../components/POScomponents/OrderSidebar";

import { products } from "../../data/products";

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mode, setMode] = useState("Now");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additional, setAdditional] = useState(0);
  const [discount, setDiscount] = useState(0);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesCategory =
          activeCategory === "All" || product.category === activeCategory;

        return matchesSearch && matchesCategory;
      }),
    [activeCategory, searchTerm]
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + additional - discount;

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const addToCart = (product) => {
    if (product.category === "Package" && mode === "Now") {
      alert("Kailangan ng lead time ng mga Package kapag nag-Now order. Piliin ang Pre-Order.");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <main className="min-h-screen bg-[#fbf7f6] p-4 md:p-8 text-[#2d1712] font-sans">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <button
              type="button"
              onClick={() => setMode("Now")}
              className={`px-5 py-3 rounded-full font-bold transition ${
                mode === "Now"
                  ? "bg-[#53362f] text-white"
                  : "bg-white text-[#8d6459] border border-[#e3c9c1]"
              }`}
            >
              Now
            </button>
            <button
              type="button"
              onClick={() => setMode("Pre-Order")}
              className={`px-5 py-3 rounded-full font-bold transition ${
                mode === "Pre-Order"
                  ? "bg-[#53362f] text-white"
                  : "bg-white text-[#8d6459] border border-[#e3c9c1]"
              }`}
            >
              Pre-Order
            </button>
          </div>

          <div className="mb-6">
            <CategoryFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <div className="mb-6 flex items-center gap-3 text-sm text-[#9b665b] uppercase font-black tracking-[0.12em]">
            <span>{activeCategory}</span>
            <div className="h-[1px] flex-1 bg-[#ead6d0]" />
            <span>{filteredProducts.length} items</span>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e7cfc8] rounded-[18px] p-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4">Order Summary</h2>
            <div className="text-sm text-[#6f5148] mb-4">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
            <OrderSidebar
              cart={cart}
              subtotal={subtotal}
              additional={additional}
              setAdditional={setAdditional}
              discount={discount}
              setDiscount={setDiscount}
              total={Math.max(0, total)}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </div>

          {mode === "Pre-Order" && (
            <div className="bg-white border border-[#e7cfc8] rounded-[18px] p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Pre-Order Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  className="w-full border rounded-lg px-4 py-3"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full border rounded-lg px-4 py-3"
                />
                <button
                  type="button"
                  className="w-full bg-[#53362f] text-white py-3 rounded-lg font-bold"
                >
                  Confirm Pre-Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
