export default function HowToOrder() {
  const steps = [
    {
      number: "01",
      title: "BROWSE MENU",
      description:
        "Explore our artisan cakes, pastries, and exclusive packages.",
    },
    {
      number: "02",
      title: "ADD TO CART",
      description:
        "Select your favorites and proceed to our seamless checkout.",
    },
    {
      number: "03",
      title: "CONFIRM DETAILS",
      description:
        "Review your order and select your preferred pickup time.",
    },
    {
      number: "04",
      title: "ENJOY",
      description:
        "Pick up your freshly baked goods and enjoy every bite.",
    },
  ];

  return (
    <>
      <section id="how-to-order" className="bg-[#F8F6F3] py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.35em] text-sm text-[#A88C76] mb-4">
              Simple Process
            </p>

            <h2 className="text-4xl md:text-5xl font-serif text-[#5A3B2E]">
              How to Order
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
            {steps.map((step) => (
              <div key={step.number}>
                <h3 className="text-7xl font-serif text-[#D8CDC7] mb-8">
                  {step.number}
                </h3>

                <h4 className="uppercase tracking-[0.15em] text-xl font-semibold text-[#6B4334] mb-5">
                  {step.title}
                </h4>

                <p className="text-[#7A6A63] leading-8 text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}