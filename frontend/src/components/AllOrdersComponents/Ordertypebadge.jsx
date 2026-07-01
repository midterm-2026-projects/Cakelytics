export default function OrderTypeBadge({ type }) {
  const style =
    type === "Buy Now"
      ? "bg-green-50 text-green-700 border border-green-200"
      : "bg-purple-50 text-purple-700 border border-purple-200";

  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${style}`}>
      {type}
    </span>
  );
}