const statuses = ["All", "Confirmed", "Ready", "Completed", "Cancelled"];

export default function Orderstatusfilter({ activeStatus, setActiveStatus }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => setActiveStatus(s)}
          className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap flex-shrink-0 border transition-colors ${
            activeStatus === s
              ? "bg-[#53362f] text-white border-[#53362f]"
              : "bg-white text-[#8d6459] border-[#e3c9c1]"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}