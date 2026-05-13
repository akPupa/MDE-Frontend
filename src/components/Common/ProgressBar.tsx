import React from "react";

interface ProgressBarItem {
  label: string;
  value: string;
  percentage: number;
}

interface SectionWiseTimeProps {
  title?: string;
  items: ProgressBarItem[];
  insight?: string;
  className?: string;
}

/**
 * ProgressBar Component
 * Renders a single progress bar with a label and value.
 */
export const ProgressBar: React.FC<ProgressBarItem> = ({ label, value, percentage }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

/**
 * SectionWiseTime Component
 * The main card container matching the user's design.
 */
const SectionWiseTime: React.FC<SectionWiseTimeProps> = ({
  title = "Section-wise Time",
  items,
  insight,
  className = "",
}) => {
  return (
    <div className={`bg-[#f0f4f4] rounded-2xl p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <ProgressBar key={index} {...item} />
        ))}
      </div>

      {insight && (
        <div className="bg-white rounded-xl p-4 mt-4 border border-white">
          <p className="text-xs leading-relaxed text-gray-500">
            <span className="text-primary font-bold">Insight:</span> {insight}
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionWiseTime;
