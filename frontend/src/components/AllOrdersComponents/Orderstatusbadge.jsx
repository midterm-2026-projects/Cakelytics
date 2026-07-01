const statusStyles = {
  Confirmed: "bg-blue-50 text-blue-600 border border-blue-200",
  Ready:     "bg-green-50 text-green-600 border border-green-200",
  Completed: "bg-[#f3ede9] text-[#7a5c52] border border-[#e0cec9]",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
};

export default function OrderTypeBadge({ status }) {
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}