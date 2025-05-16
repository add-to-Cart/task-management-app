export default function PriorityBadge({ priority }) {
  if (!priority) return null;

  const priorityStyles = {
    low: "bg-green-400 text-gray-900",
    high: "bg-red-600 text-white",
    normal: "bg-yellow-400 text-white",
  };

  return (
    <span
      className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
        priorityStyles[priority] || ""
      }`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
