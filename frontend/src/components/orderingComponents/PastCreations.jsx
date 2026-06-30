export default function PastCreations() {
  const cakes = [
    "/cakes/cake1.jpg",
    "/cakes/cake2.jpg",
    "/cakes/cake3.jpg",
    "/cakes/cake4.jpg",
    "/cakes/cake5.jpg",
    "/cakes/cake6.jpg",
    "/cakes/cake7.jpg",
    "/cakes/cake8.jpg",
    "/cakes/cake9.jpg",
    "/cakes/cake10.jpg",
  ];

  return (
    <section className="bg-[#F8F6F3] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-[#5B4034]">
            Some Past Creations
          </h2>

          <p className="mt-4 text-[#9A7B6A] italic text-xl">
            A glimpse of the bespoke orders we've crafted for our customers.
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {cakes.map((cake, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              <img
                src={cake}
                alt={`Cake ${index + 1}`}
                className="w-full h-[260px] object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}