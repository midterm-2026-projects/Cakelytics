export default function OrderProgress() {
  const steps = [
    "Select Items",
    "Details",
    "Payment",
    "Complete",
  ];

  return (
    <section className="bg-[#F8F6F3] py-8 border-b">
      <div className="max-w-5xl mx-auto px-6">

        <div className="flex items-center justify-between">

          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center flex-1"
            >
              <div className="flex flex-col items-center w-full">

                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold
                  ${
                    index === 0
                      ? "border-[#5A3B2E] text-[#5A3B2E]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index === 3 ? "✓" : index + 1}
                </div>

                <p
                  className={`mt-3 text-sm font-medium
                  ${
                    index === 0
                      ? "text-[#5A3B2E]"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </p>

              </div>

              {index !== steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-300 mb-8"></div>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}