// import { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toPng } from "html-to-image";
// import OrderProgress from "../../components/orderingComponents/OrderProgress";

// export default function Receipt() {
//   const receiptRef = useRef(null);
//   const navigate = useNavigate();

//   const [orderData, setOrderData] = useState(null);
//   const [isSaved, setIsSaved] = useState(false);

//   // -----------------------------
//   // LOAD ORDER FROM STORAGE
//   // -----------------------------
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("orderData");

//       if (saved) {
//         setOrderData(JSON.parse(saved));
//       }
//     } catch (err) {
//       console.error("Failed to load order:", err);
//     }
//   }, []);

//   // -----------------------------
//   // PREVENT LEAVING WITHOUT SAVE
//   // -----------------------------
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (!isSaved) {
//         e.preventDefault();
//         e.returnValue = "";
//       }
//     };

//     window.addEventListener(
//       "beforeunload",
//       handleBeforeUnload
//     );

//     return () => {
//       window.removeEventListener(
//         "beforeunload",
//         handleBeforeUnload
//       );
//     };
//   }, [isSaved]);

//   // -----------------------------
//   // SAVE RECEIPT
//   // -----------------------------
//   const handleSaveImage = async () => {
//     if (!receiptRef.current || !orderData) return;

//     try {
//       const dataUrl = await toPng(receiptRef.current, {
//         cacheBust: true,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         skipFonts: true,
//       });

//       const link = document.createElement("a");
//       link.href = dataUrl;
//       link.download = `${orderData.orderNumber}.png`;
//       link.click();

//       setIsSaved(true);
//     } catch (err) {
//       console.error("Receipt Image Error:", err);
//       alert("Unable to save receipt.");
//     }
//   };

//   // -----------------------------
//   // LOADING
//   // -----------------------------
//   if (!orderData) {
//     return (
//       <div className="text-center py-20 text-lg">
//         Loading receipt...
//       </div>
//     );
//   }

//   // -----------------------------
//   // GO HOME
//   // -----------------------------
//   const handleGoHome = () => {
//     if (!isSaved) {
//       alert("Please save your receipt before leaving.");
//       return;
//     }

//     localStorage.removeItem("orderData");
//     navigate("/");
//   };

//   return (
//     <>
//       <OrderProgress />

//       <section className="bg-[#F8F6F3] min-h-screen py-10 px-4">
//         <div className="max-w-md mx-auto">

//           {/* RECEIPT */}
//           <div
//             ref={receiptRef}
//             className="bg-white rounded-2xl shadow-lg p-8"
//           >
//             <h1 className="text-3xl font-bold text-center text-[#4A1F00]">
//               Order Placed!
//             </h1>

//             <p className="text-center text-gray-500 mt-3 mb-8">
//               Save your receipt and present the QR code at the counter.
//             </p>

//             <div className="border rounded-xl p-5">

//               <h2 className="text-xl font-bold text-center text-[#4A1F00]">
//                 Aileen Cake Max
//               </h2>

//               <p className="text-center text-gray-500 mb-6">
//                 Bake Shop
//               </p>

//               {/* ORDER INFO */}
//               <div className="flex justify-between mb-2">
//                 <span className="font-semibold">
//                   Order No.
//                 </span>

//                 <span>
//                   {orderData.orderNumber}
//                 </span>
//               </div>

//               <div className="flex justify-between mb-2">
//                 <span className="font-semibold">
//                   Date
//                 </span>

//                 <span>
//                   {orderData.dateCreated}
//                 </span>
//               </div>

//               <div className="flex justify-between mb-2">
//                 <span className="font-semibold">
//                   Customer
//                 </span>

//                 <span>
//                   {orderData.name}
//                 </span>
//               </div>

//               <div className="flex justify-between mb-4">
//                 <span className="font-semibold">
//                   Contact
//                 </span>

//                 <span>
//                   {orderData.contact}
//                 </span>
//               </div>

//               <hr className="mb-4" />

//               {/* ITEMS */}
//               {orderData.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex justify-between mt-2"
//                 >
//                   <span>
//                     {item.qty} × {item.name}
//                   </span>

//                   <span>
//                     ₱
//                     {(item.qty * item.price).toFixed(2)}
//                   </span>
//                 </div>
//               ))}

//               <hr className="my-4" />

//               {/* TOTAL */}
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>

//                 <span>
//                   ₱
//                   {orderData.total.toFixed(2)}
//                 </span>
//               </div>

//               {/* PAYMENT */}
//               <div className="flex justify-between mt-2 text-sm text-gray-600">
//                 <span>Payment</span>

//                 <span>
//                   {orderData.paymentType === "deposit"
//                     ? "50% Deposit"
//                     : "Full Payment"}
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Amount Due</span>

//                 <span>
//                   ₱
//                   {orderData.deposit.toFixed(2)}
//                 </span>
//               </div>

//               {/* QR CODE */}
//               <div className="flex flex-col items-center mt-8">
//                 <img
//                   crossOrigin="anonymous"
//                   loading="eager"
//                   src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderData.orderNumber}`}
//                   alt="QR Code"
//                   className="w-44 h-44"
//                 />

//                 <p className="text-sm text-gray-500 mt-3">
//                   Scan to verify
//                 </p>
//               </div>

//             </div>
//           </div>

//           {/* BUTTONS */}
//           <button
//             onClick={handleSaveImage}
//             className="w-full mt-6 bg-[#4A1F00] text-white py-3 rounded-lg hover:bg-[#341500] transition"
//           >
//             ↓ Save Receipt as Image
//           </button>

//           <p className="text-center text-red-500 text-sm mt-3">
//             Please save your receipt before leaving this page.
//           </p>

//           <button
//             onClick={handleGoHome}
//             className="block mx-auto mt-5 text-[#4A1F00] font-semibold hover:underline"
//           >
//             Back to Home
//           </button>

//         </div>
//       </section>
//     </>
//   );
// }

import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import OrderProgress from "../../components/orderingComponents/OrderProgress";

export default function Receipt() {
  const receiptRef = useRef(null);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);

  const [isSaved, setIsSaved] = useState(
    localStorage.getItem("receiptSaved") === "true"
  );

  // -----------------------------
  // LOAD ORDER
  // -----------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("orderData");

      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load order:", err);
    }
  }, []);

  // -----------------------------
  // PREVENT LEAVING
  // -----------------------------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isSaved]);

  // -----------------------------
  // SAVE RECEIPT
  // -----------------------------
  const handleSaveImage = async () => {
    if (!receiptRef.current || !orderData) return;

    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${orderData.orderNumber}.png`;
      link.click();

     setIsSaved(true);
     localStorage.setItem("receiptSaved", "true");

     alert("Receipt saved successfully!");

    } catch (err) {
      console.error("Receipt Image Error:", err);
      alert("Unable to save receipt.");
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (!orderData) {
    return (
      <div className="text-center py-20 text-lg">
        Loading receipt...
      </div>
    );
  }

  // -----------------------------
  // GO HOME
  // -----------------------------
  const handleGoHome = () => {
    if (!isSaved) {
      alert("Please save your receipt before leaving.");
      return;
    }

    localStorage.removeItem("orderData");
    localStorage.removeItem("receiptSaved");

    navigate("/");
  };

  return (
    <>
      <OrderProgress />

      <section className="bg-[#F8F6F3] min-h-screen py-10 px-4">
        <div className="max-w-md mx-auto">

          <div
            ref={receiptRef}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h1 className="text-3xl font-bold text-center text-[#4A1F00]">
              Order Placed!
            </h1>

            <p className="text-center text-gray-500 mt-3 mb-8">
              Save your receipt and present the QR code at the counter.
            </p>

            <div className="border rounded-xl p-5">

              <h2 className="text-xl font-bold text-center text-[#4A1F00]">
                Aileen Cake Max
              </h2>

              <p className="text-center text-gray-500 mb-6">
                Bake Shop
              </p>

              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  Order No.
                </span>

                <span>{orderData.orderNumber}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  Date
                </span>

                <span>{orderData.dateCreated}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  Customer
                </span>

                <span>{orderData.name}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-semibold">
                  Contact
                </span>

                <span>{orderData.contact}</span>
              </div>

              <hr className="mb-4" />

              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mt-2"
                >
                  <span>
                    {item.qty} × {item.name}
                  </span>

                  <span>
                    ₱
                    {(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>
                  ₱
                  {orderData.total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Payment</span>

                <span>
                  {orderData.paymentType === "deposit"
                    ? "50% Deposit"
                    : "Full Payment"}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Amount Due</span>

                <span>
                  ₱
                  {orderData.deposit.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col items-center mt-8">
                <img
                  crossOrigin="anonymous"
                  loading="eager"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderData.orderNumber}`}
                  alt="QR Code"
                  className="w-44 h-44"
                />

                <p className="text-sm text-gray-500 mt-3">
                  Scan to verify
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={handleSaveImage}
            className="w-full mt-6 bg-[#4A1F00] text-white py-3 rounded-lg hover:bg-[#341500] transition"
          >
            ↓ Save Receipt as Image
          </button>

          <p className="text-center text-red-500 text-sm mt-3">
            Please save your receipt before leaving this page.
          </p>

          <button
            onClick={handleGoHome}
            className="block mx-auto mt-5 text-[#4A1F00] font-semibold hover:underline"
          >
            Back to Home
          </button>

        </div>
      </section>
    </>
  );
}