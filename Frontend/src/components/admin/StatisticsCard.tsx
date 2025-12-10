import React from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  description,
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const bgClass = colorClasses[color] || colorClasses["blue"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between transition-transform hover:-translate-y-1 h-full">
      {/* Cột chữ bên trái */}
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">
          {title}
        </p>

        {/* - cursor-help: Con trỏ chuột chuyển thành dấu ? khi hover
                   - title: Chứa giá trị đầy đủ (hiện sau 1s)
                */}
        <h3
          className="text-xl font-bold text-slate-800 truncate tracking-tight cursor-help"
          title={String(value)}
        >
          {value}
        </h3>

        {description && (
          <p
            className="text-[15px] text-slate-400 mt-1 truncate"
            title={description}
          >
            {description}
          </p>
        )}
      </div>

      <div className={`p-2 rounded-lg ${bgClass} flex-shrink-0 ml-2`}>
        {icon}
      </div>
    </div>
  );
};

export default StatisticsCard;
