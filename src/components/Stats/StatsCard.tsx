import type { StatsItem } from "./types";

const variantStyles = {
  green: {
    icon: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    border: "hover:border-green-200",
    stat: "bg-green-100 text-green-700",
  },
  yellow: {
    icon: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white",
    border: "hover:border-yellow-200",
    stat: "bg-yellow-100 text-yellow-700",
  },
  red: {
    icon: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    border: "hover:border-red-200",
    stat: "bg-red-100 text-red-700",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    border: "hover:border-blue-200",
    stat: "bg-blue-100 text-blue-700",
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  stat,
  variant = "blue",
}: StatsItem) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flex flex-col bg-white rounded-xl p-6 shadow-sm border border-transparent transition-all group ${styles.border}`}
    >
      {/* Top */}
      <div className="flex justify-between items-center mb-3">
        <div
          className={`p-3 rounded-lg transition-all ${styles.icon}`}
        >
          <Icon size={18} />
        </div>

        {stat && (
          <span
            className={`text-[10px] font-bold py-1 px-2 rounded-full ${styles.stat}`}
          >
            {stat}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
        {label}
      </p>

      {/* Value */}
      <h3 className="text-2xl font-extrabold text-gray-900">
        {value}
      </h3>
    </div>
  );
}