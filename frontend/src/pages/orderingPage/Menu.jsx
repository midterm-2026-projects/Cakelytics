import { useEffect, useState } from "react";
import axios from "axios"; // Siguraduhing naka-import ang axios

import ProductCard from "../../components/orderingComponents/ProductCard";
import OrderProgress from "../../components/orderingComponents/OrderProgress";
import CategoryFilters from "../../components/orderingComponents/CategoryFilters";
import Cart from "../../components/orderingComponents/Cart";
import Footer from "../../components/orderingComponents/Footer";
import Navbar from "../../components/orderingComponents/Navbar";

export default function Menu() {
  // =========================
  // States
  // =========================
  const [products, setProducts] = useState([]); // Empty array muna sa simula
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // =========================
  // ✨ FETCH PRODUCTS FROM BACKEND (Live Supabase Data)
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Palitan ang URL na ito base sa tamang endpoint ng inyong Products API
        const response = await axios.get("http://localhost:3000/api/products");
        
        // I-map ang database structure kung magkaiba ang pangalan ng field (hal. image_url -> image)
        const liveProducts = (response.data.data || response.data).map(prod => ({
          id: prod.id, // Ito na ang totoong UUID mula sa Supabase!
          name: prod.name,
          category: prod.category,
          price: prod.price,
          stock: prod.stock_quantity > 0 ? "Available" : "Out of Stock",
          image: prod.image_url || "/products/chocolate-rolls.jpg" // Fallback fallback image
        }));

        setProducts(liveProducts);
        setFilteredProducts(liveProducts); // I-set din ang initial view
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // Save Cart
  // =========================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =========================
  // Category Filter
  // =========================
  const filterCategory = (category) => {
    setSelectedCategory(category);

    if (category === "ALL") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.category.toUpperCase() === category.toUpperCase()
    );

    setFilteredProducts(filtered);
  };

  // =========================
  // Add To Cart
  // =========================
  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1 }
      ]);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <OrderProgress />

      <CategoryFilters
        selectedCategory={selectedCategory}
        filterCategory={filterCategory}
      />

      <section className="bg-[#F8F6F3] py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-10">

          {/* Products Column */}
          <div className="lg:col-span-3">

            {loading ? (
              <p className="text-center text-gray-500">Loading menu items...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500">
                No products found.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Shopping Cart */}
          <Cart
            cart={cart}
            setCart={setCart}
          />

        </div>
      </section>

      <Footer />
    </>
  );
}