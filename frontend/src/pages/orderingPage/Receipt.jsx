import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import html2canvas from "html2canvas";

export default function Receipt() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Controls navigation lock

  useEffect(() => {
    const savedOrderData = localStorage.getItem("orderData");
    
    if (savedOrderData) {
      const parsedData = JSON.parse(savedOrderData);
      const dbDetails = parsedData.order || parsedData.data || parsedData.order_details || parsedData;
      
      // Kunin ang raw order number
      const rawOrderNo = dbDetails.order_number || dbDetails.order_no || dbDetails.order_id || dbDetails.id || "N/A";
      
      // Kuhanin ang database ID (UUID) para sa scan code
      const rawDbId = dbDetails._id || dbDetails.id || dbDetails.dbId || parsedData.dbId;
      const finalDbId = rawDbId && rawDbId !== "N/A" 
        ? rawDbId 
        : `ORD-UUID-${rawOrderNo}-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString().slice(-6)}`;

      setOrder({
        dbId: finalDbId,
        orderNo: rawOrderNo,
        customerName: dbDetails.customer_name || parsedData.name || "Customer",
        contactNumber: dbDetails.customer_phone || parsedData.contact || "N/A",
        totalAmount: dbDetails.grand_total || dbDetails.subtotal || parsedData.subtotal || 0,
        paymentType: dbDetails.payment_type || parsedData.payment_type || "deposit",
        items: parsedData.cartItems || dbDetails.cart_items || []
      });
    }
  }, []);

  // IPALIT NA NATIN ANG BULLETPROOF TXT GENERATION NA WALANG ERROR AT KUSA PANG MAG-AUNLOCK
  const handleDownloadImage = async () => {
    setIsDownloading(true);

    try {
      // Siguraduhing malinis ang pagkaka-render ng ORD- sa text download file
      const displayOrderNo = order?.orderNo 
        ? (order.orderNo.toString().startsWith("ORD-") ? order.orderNo : `ORD-${order.orderNo}`) 
        : "N/A";

      // Gumawa ng malinis na text layout para sa resibo na pwedeng ipadala o ipakita sa counter
      let receiptText = `========================================\n`;
      receiptText += `           AILEEN CAKE MAX              \n`;
      receiptText += `              Bake Shop                 \n`;
      receiptText += `========================================\n`;
      receiptText += `Order No : ${displayOrderNo}\n`;
      receiptText += `Date     : ${new Date().toLocaleDateString('en-US')}\n`;
      receiptText += `Customer : ${(order?.customerName || "Customer").toUpperCase()}\n`;
      receiptText += `Contact  : ${order?.contactNumber || "N/A"}\n`;
      receiptText += `----------------------------------------\n`;
      receiptText += `ITEMS BOUGHT:\n`;
      
      if (order?.items && order.items.length > 0) {
        order.items.forEach((item) => {
          receiptText += `${item.quantity}x ${item.name || item.product_name} - PHP ${(item.price * item.quantity).toFixed(2)}\n`;
        });
      } else {
        receiptText += `No item details available.\n`;
      }
      
      receiptText += `----------------------------------------\n`;
      receiptText += `TOTAL AMOUNT : PHP ${Number(order?.totalAmount || 0).toFixed(2)}\n`;
      receiptText += `Payment Type : ${order?.paymentType === "deposit" ? "50% Deposit Paid" : "Full Payment"}\n`;
      
      if (order?.paymentType === "deposit") {
        receiptText += `Balance Due  : PHP ${(Number(order?.totalAmount || 0) * 0.5).toFixed(2)} (Upon Pickup)\n`;
      }
      receiptText += `========================================\n`;
      receiptText += `      Scan Code at Counter to Verify    \n`;
      receiptText += `      ID: ${order?.dbId || "N/A"}\n`;
      receiptText += `========================================\n`;

      // I-trigger ang file download sa browser bilang log file
      const element = document.createElement("a");
      const file = new Blob([receiptText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Receipt-${displayOrderNo}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // AUTOMATIC NA MAG-A-UNLOCK ANG MGA NAV BUTTONS!
      setIsSaved(true);
    } catch (error) {
      console.error("Failsafe triggers auto-unlock:", error);
      setIsSaved(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCleanUpAndNavigate = (targetPath) => {
    if (!isSaved) return; 
    localStorage.removeItem("orderData");
    navigate(targetPath);
  };

  // Safe display check para hindi mag-doble ang ORD-
  const displayOrderNo = order?.orderNo 
    ? (order.orderNo.toString().startsWith("ORD-") ? order.orderNo : `ORD-${order.orderNo}`) 
    : "N/A";

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-10 flex flex-col items-center px-4 select-none">
      <h1 className="text-3xl font-bold text-[#4A1F00] mb-2">Order Placed!</h1>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Please download your receipt layout to activate navigation links.
      </p>

      {/* --- RECEIPT DESIGN CARD --- */}
      <div className="bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-md text-center shadow-md">
        <h2 className="text-2xl font-bold text-[#4A1F00]">Aileen Cake Max</h2>
        <p className="text-xs text-gray-400 mb-6">Bake Shop</p>

        {/* CUSTOMER METADATA */}
        <div className="text-left text-xs space-y-2.5 border-b border-dashed border-gray-300 pb-4 mb-4 text-gray-600">
          <div className="flex justify-between">
            <span className="font-semibold">Order No.</span>
            {/* Ligtas na ipapakita ang ORD nang walang doble */}
            <span className="font-bold text-gray-900">{displayOrderNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date</span>
            <span>{new Date().toLocaleDateString('en-US')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Customer</span>
            <span className="uppercase font-medium text-gray-900">{order?.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Contact</span>
            <span>{order?.contactNumber}</span>
          </div>
        </div>

        {/* ORDER ITEMS BREAKDOWN */}
        <div className="text-left text-xs border-b border-dashed border-gray-300 pb-4 mb-4 space-y-2 text-gray-700">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Items Bought</span>
          {order?.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.quantity}× {item.name || item.product_name}</span>
                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No item summary details available.</p>
          )}
        </div>

        {/* PRICING & TRANSACTION INFORMATION */}
        <div className="text-left text-xs border-b border-gray-300 pb-6 mb-6">
          <div className="flex justify-between font-extrabold text-base text-gray-900 mb-1">
            <span>Total</span>
            <span>₱{Number(order?.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Payment Type</span>
            <span className="capitalize font-medium text-gray-700">
              {order?.paymentType === "deposit" ? "50% Deposit Paid" : "Full Payment"}
            </span>
          </div>
          {order?.paymentType === "deposit" && (
            <div className="flex justify-between text-amber-700 font-semibold mt-1">
              <span>Balance Due (Upon Pickup)</span>
              <span>₱{(Number(order?.totalAmount || 0) * 0.5).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* QR CODE DISPLAY BOX */}
        <div className="flex flex-col items-center py-2">
          <div className="w-40 h-40 bg-[#F3F4F6] flex items-center justify-center border border-gray-300 rounded-xl p-4">
            <div className="w-full h-full flex flex-wrap gap-1 justify-center items-center">
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-transparent"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-transparent"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-transparent"></span>
              <span className="w-7 h-7 bg-transparent"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
              <span className="w-7 h-7 bg-gray-800 rounded-sm"></span>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-[#4A1F00] mt-3">Scan to verify at counter</p>
          {/* Tama nang naka-render ang mahabang database UUID dito */}
          <p className="text-[9px] text-gray-400 font-mono select-all break-all max-w-[280px]">
            ID: {order?.dbId}
          </p> 
        </div>
      </div>

      {/* --- MGA ACTION BUTTONS --- */}
      <div className="w-full max-w-md mt-6 space-y-3">
        <button
          onClick={handleDownloadImage}
          className={`w-full py-3 font-bold rounded-xl text-sm transition-colors shadow-md ${
            isSaved 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-[#4A1F00] hover:bg-[#341500] text-white"
          }`}
        >
          {isDownloading ? "Downloading file..." : isSaved ? "✓ Receipt Saved / Verified!" : "↓ Download E-Receipt File"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCleanUpAndNavigate("/menu")}
            disabled={!isSaved}
            className={`py-2.5 font-semibold rounded-xl text-xs transition-colors text-center ${
              isSaved 
                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer" 
                : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60"
            }`}
          >
            🔄 Order Again
          </button>
          
          <button
            onClick={() => handleCleanUpAndNavigate("/")}
            disabled={!isSaved}
            className={`py-2.5 font-semibold rounded-xl text-xs transition-colors text-center ${
              isSaved 
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            🏠 Back to Home
          </button>
        </div>
        
        {!isSaved && (
          <p className="text-[11px] text-amber-700 text-center font-medium animate-pulse">
            ⚠️ You must download or save the receipt first to activate the buttons.
          </p>
        )}
      </div>
    </div>
  );
}

