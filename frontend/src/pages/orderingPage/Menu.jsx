// import { useState } from "react";
// import ProductCard from "../customerComponents/ProductCard";

// export default function Menu() {
//   const [cart, setCart] = useState([]);

//   const products = [
//     {
//     id: 1,
//     name: "Chocolate Cake",
//     category: "Birthday Cake",
//     price: 850,
//     stock: "Available",
//     image: "/products/chocolate-rolls.jpg",
//   },
//   {
//     id: 2,
//     name: "Crinkles",
//     category: "Pastry",
//     price: 15,
//     stock: "Available",
//     image: "/products/crinkles.jpg",
//   },
//   {
//     id: 3,
//     name: "Cupcake",
//     category: "Pastry",
//     price: 25,
//     stock: "Available",
//     image: "/products/cupcake.jpg",
//   },
//   {
//     id: 4,
//     name: "Brownies",
//     category: "Pastry",
//     price: 20,
//     stock: "Available",
//     image: "/products/brownies.jpg",
//   },
//   {
//     id: 5,
//     name: "Buko Pie",
//     category: "Pastry",
//     price: 30,
//     stock: "Available",
//     image: "/products/buko-pie.jpg",
//   },
//   {
//     id: 6,
//     name: "Egg Pie",
//     category: "Pastry",
//     price: 30,
//     stock: "Available",
//     image: "/products/egg-pie.jpg",
//   },
//   {
//     id: 7,
//     name: "Mamon",
//     category: "Pastry",
//     price: 18,
//     stock: "Available",
//     image: "/products/mamon.jpg",
//   },
//   {
//     id: 8,
//     name: "Pianono",
//     category: "Pastry",
//     price: 20,
//     stock: "Available",
//     image: "/products/pianono.jpg",
//   },
//   {
//     id: 9,
//     name: "Yema Cake",
//     category: "Cake",
//     price: 35,
//     stock: "Available",
//     image: "/products/yema-cake.jpg",
//   },
//   {
//     id: 10,
//     name: "Banana Cake",
//     category: "Cake",
//     price: 30,
//     stock: "Available",
//     image: "/products/banana-cake.jpg",
//   },
//   {
//     id: 11,
//     name: "Empanada",
//     category: "Pastry",
//     price: 28,
//     stock: "Available",
//     image: "/products/empanada.jpg",
//   },
//   {
//     id: 12,
//     name: "Sans Rival",
//     category: "Cake",
//     price: 45,
//     stock: "Available",
//     image: "/products/sans-rival.jpg",
//   },
//   {
//     id: 13,
//     name: "Coconut Macaroons",
//     category: "Pastry",
//     price: 12,
//     stock: "Available",
//     image: "/products/coconut-macaroons.jpg",
//   },
//   {
//     id: 14,
//     name: "Hopia",
//     category: "Pastry",
//     price: 15,
//     stock: "Available",
//     image: "/products/hopia.jpg",
//   },
//   {
//     id: 15,
//     name: "Polvoron",
//     category: "Pastry",
//     price: 12,
//     stock: "Available",
//     image: "/products/polvoron.jpg",
//   },
//   {
//     id: 16,
//     name: "Leche Flan",
//     category: "Dessert",
//     price: 55,
//     stock: "Available",
//     image: "/products/leche-flan.jpg",
//   },
//   {
//     id: 17,
//     name: "Cheese Bread",
//     category: "Bread",
//     price: 22,
//     stock: "Available",
//     image: "/products/cheese-bread.jpg",
//   },
//   {
//     id: 18,
//     name: "Ube Cake",
//     category: "Cake",
//     price: 40,
//     stock: "Available",
//     image: "/products/ube-cake.jpg",
//   },
//   {
//     id: 19,
//     name: "Ensaymada",
//     category: "Bread",
//     price: 7,
//     stock: "Available",
//     image: "/products/ensaymada.jpg",
//   },
//   {
//     id: 20,
//     name: "Pandesal",
//     category: "Bread",
//     price: 8,
//     stock: "Available",
//     image: "/products/pandesal.jpg",
//   },
//   {
//     id: 21,
//     name: "Package A",
//     category: "Package",
//     price: 1200,
//     stock: "Available",
//     image: "/products/package-a.jpg",
//   },
//   {
//     id: 22,
//     name: "Package B",
//     category: "Package",
//     price: 1500,
//     stock: "Available",
//     image: "/products/package-b.jpg",
//   },
//   {
//     id: 23,
//     name: "Package C",
//     category: "Package",
//     price: 2000,
//     stock: "Available",
//     image: "/products/package-c.jpg",
//   },
//   {
//     id: 24,
//     name: "Package D",
//     category: "Package",
//     price: 3000,
//     stock: "Available",
//     image: "/products/package-d.jpg",
//   },
//   {
//     id: 25,
//     name: "Package E",
//     category: "Package",
//     price: 1000,
//     stock: "Available",
//     image: "/products/package-e.jpg",
//   },
//   {
//     id: 26,
//     name: "Package AB",
//     category: "Package",
//     price: 1400,
//     stock: "Available",
//     image: "/products/package-ab.jpg",
//   },
//   {
//     id: 27,
//     name: "Package EA",
//     category: "Package",
//     price: 2000,
//     stock: "Available",
//     image: "/products/package-ea.jpg",
//   },
//   {
//     id: 28,
//     name: "Printed Balloons",
//     category: "Celebration Material",
//     price: 15,
//     stock: "Available",
//     image: "/products/printed-balloons.jpg",
//   },
//   {
//     id: 29,
//     name: "Tarpaulin",
//     category: "Celebration Material",
//     price: 0, // Update kapag may final price
//     stock: "Available",
//     image: "/products/tarpaulin.jpg",
//   },
//   ];

//   const addToCart = (product) => {
//     const existing = cart.find((item) => item.id === product.id);

//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       );
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   return (
//     <section className="bg-[#F8F6F3] py-10 min-h-screen">
//       <div className="max-w-7xl mx-auto px-6">

//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               addToCart={addToCart}
//             />
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }

import { useEffect, useState } from "react";

import ProductCard from "../../components/orderingComponents/ProductCard";
import OrderProgress from "../../components/orderingComponents/OrderProgress";
import CategoryFilters from "../../components/orderingComponents/CategoryFilters";
import Cart from "../../components/orderingComponents/Cart";
import Footer from "../../components/orderingComponents/Footer";

export default function Menu() {

  // =========================
  // Products
  // =========================
  const products = [
    {
    id: 1,
    name: "Chocolate Cake",
    category: "Birthday Cake",
    price: 850,
    stock: "Available",
    image: "/products/chocolate-rolls.jpg",
  },
  {
    id: 2,
    name: "Crinkles",
    category: "Pastry",
    price: 15,
    stock: "Available",
    image: "/products/crinkles.jpg",
  },
  {
    id: 3,
    name: "Cupcake",
    category: "Pastry",
    price: 25,
    stock: "Available",
    image: "/products/cupcake.jpg",
  },
  {
    id: 4,
    name: "Brownies",
    category: "Pastry",
    price: 20,
    stock: "Available",
    image: "/products/brownies.jpg",
  },
  {
    id: 5,
    name: "Buko Pie",
    category: "Pastry",
    price: 30,
    stock: "Available",
    image: "/products/buko-pie.jpg",
  },
  {
    id: 6,
    name: "Egg Pie",
    category: "Pastry",
    price: 30,
    stock: "Available",
    image: "/products/egg-pie.jpg",
  },
  {
    id: 7,
    name: "Mamon",
    category: "Pastry",
    price: 18,
    stock: "Available",
    image: "/products/mamon.jpg",
  },
  {
    id: 8,
    name: "Pianono",
    category: "Pastry",
    price: 20,
    stock: "Available",
    image: "/products/pianono.jpg",
  },
  {
    id: 9,
    name: "Yema Cake",
    category: "Cake",
    price: 35,
    stock: "Available",
    image: "/products/yema-cake.jpg",
  },
  {
    id: 10,
    name: "Banana Cake",
    category: "Cake",
    price: 30,
    stock: "Available",
    image: "/products/banana-cake.jpg",
  },
  {
    id: 11,
    name: "Empanada",
    category: "Pastry",
    price: 28,
    stock: "Available",
    image: "/products/empanada.jpg",
  },
  {
    id: 12,
    name: "Sans Rival",
    category: "Cake",
    price: 45,
    stock: "Available",
    image: "/products/sans-rival.jpg",
  },
  {
    id: 13,
    name: "Coconut Macaroons",
    category: "Pastry",
    price: 12,
    stock: "Available",
    image: "/products/coconut-macaroons.jpg",
  },
  {
    id: 14,
    name: "Hopia",
    category: "Pastry",
    price: 15,
    stock: "Available",
    image: "/products/hopia.jpg",
  },
  {
    id: 15,
    name: "Polvoron",
    category: "Pastry",
    price: 12,
    stock: "Available",
    image: "/products/polvoron.jpg",
  },
  {
    id: 16,
    name: "Leche Flan",
    category: "Dessert",
    price: 55,
    stock: "Available",
    image: "/products/leche-flan.jpg",
  },
  {
    id: 17,
    name: "Cheese Bread",
    category: "Bread",
    price: 22,
    stock: "Available",
    image: "/products/cheese-bread.jpg",
  },
  {
    id: 18,
    name: "Ube Cake",
    category: "Cake",
    price: 40,
    stock: "Available",
    image: "/products/ube-cake.jpg",
  },
  {
    id: 19,
    name: "Ensaymada",
    category: "Bread",
    price: 7,
    stock: "Available",
    image: "/products/ensaymada.jpg",
  },
  {
    id: 20,
    name: "Pandesal",
    category: "Bread",
    price: 8,
    stock: "Available",
    image: "/products/pandesal.jpg",
  },
  {
    id: 21,
    name: "Package A",
    category: "Package",
    price: 1200,
    stock: "Available",
    image: "/products/package-a.jpg",
  },
  {
    id: 22,
    name: "Package B",
    category: "Package",
    price: 1500,
    stock: "Available",
    image: "/products/package-b.jpg",
  },
  {
    id: 23,
    name: "Package C",
    category: "Package",
    price: 2000,
    stock: "Available",
    image: "/products/package-c.jpg",
  },
  {
    id: 24,
    name: "Package D",
    category: "Package",
    price: 3000,
    stock: "Available",
    image: "/products/package-d.jpg",
  },
  {
    id: 25,
    name: "Package E",
    category: "Package",
    price: 1000,
    stock: "Available",
    image: "/products/package-e.jpg",
  },
  {
    id: 26,
    name: "Package AB",
    category: "Package",
    price: 1400,
    stock: "Available",
    image: "/products/package-ab.jpg",
  },
  {
    id: 27,
    name: "Package EA",
    category: "Package",
    price: 2000,
    stock: "Available",
    image: "/products/package-ea.jpg",
  },
  {
    id: 28,
    name: "Printed Balloons",
    category: "Celebration Material",
    price: 15,
    stock: "Available",
    image: "/products/printed-balloons.jpg",
  },
  {
    id: 29,
    name: "Tarpaulin",
    category: "Celebration Material",
    price: 180, // Update kapag may final price
    stock: "Available",
    image: "/products/tarpaulin.jpg",
  },
  ];

  // =========================
  // States
  // =========================
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [filteredProducts, setFilteredProducts] = useState(products);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

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
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <>
      {/* Order Progress */}
      <OrderProgress />

      {/* Category Filters */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        filterCategory={filterCategory}
      />

      {/* Menu */}
      <section className="bg-[#F8F6F3] py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-10">

          {/* Products */}
          <div className="lg:col-span-3">

            {filteredProducts.length === 0 ? (
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

      {/* Footer */}
      <Footer />
    </>
  );
}