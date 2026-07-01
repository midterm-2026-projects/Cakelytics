import { useLocation } from "react-router-dom";

export default function OrderProgress() {
  const location = useLocation();

  const steps = [
    {
      label: "Select Items",
      path: "/menu",
    },
    {
      label: "Details",
      path: "/checkout",
    },
    {
      label: "Payment",
      path: "/payment",
    },
    {
      label: "Complete",
      path: "/receipt",
    },
  ];

  const currentStep = steps.findIndex(
    (step) => step.path === location.pathname
  );

  const receiptSaved =
    localStorage.getItem("receiptSaved") === "true";

  return (
    <section className="bg-[#F8F6F3] py-8 border-b">
      <div className="max-w-5xl mx-auto px-6">

        <div className="flex items-center justify-between">

          {steps.map((step, index) => {

            const isActive = index === currentStep;

            const isCompleted =
              index < currentStep ||
              (index === 3 && receiptSaved);

            return (
              <div
                key={step.path}
                className="flex items-center flex-1"
              >
                <div className="flex flex-col items-center w-full">

                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold
                    ${
                      isActive || isCompleted
                        ? "border-[#5A3B2E] text-[#5A3B2E]"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-3 text-sm font-medium
                    ${
                      isActive || isCompleted
                        ? "text-[#5A3B2E]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mb-8 ${
                      isCompleted
                        ? "bg-[#5A3B2E]"
                        : "bg-gray-300"
                    }`}
                  />
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}