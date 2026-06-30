import { Link } from "react-router-dom";

export default function FeaturedCategories() {
  return (
    <section className="bg-[#F8F6F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* Celebration Packages */}
          <Link
            to="/menu"
            className="group relative overflow-hidden"
          >
            <img
              src="/categories/celebration.jpg"
              alt="Celebration Packages"
              className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/35 flex items-end p-8">
              <div className="text-white">
                <h3 className="font-serif text-4xl mb-3">
                  Celebration Packages
                </h3>

                <p className="text-sm md:text-base max-w-md">
                  Complete sets featuring our signature themed cakes,
                  cupcakes, and balloons for a hassle-free celebration.
                </p>
              </div>
            </div>
          </Link>

          {/* Filipino Common Pastries */}
          <Link
            to="/menu"
            className="group relative overflow-hidden"
          >
            <img
              src="/categories/pastries.jpg"
              alt="Filipino Common Pastries"
              className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/35 flex items-end p-8">
              <div className="text-white">
                <h3 className="font-serif text-4xl mb-3">
                  Filipino Common Pastries
                </h3>

                <p className="text-sm md:text-base max-w-md">
                  Freshly baked daily treats from our classic crinkles,
                  brownies, ensaymada, and more.
                </p>
              </div>
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}