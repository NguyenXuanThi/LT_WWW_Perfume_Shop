import React from "react";

// Biểu đồ cột (Vertical Bar Chart) - Đã nâng cấp UI
export const SimpleBarChart = ({
  data,
  labelKey,
  valueKey,
  color = "bg-blue-500",
  height = "h-72", // Tăng chiều cao mặc định
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  color?: string;
  height?: string;
}) => {
  if (!data || data.length === 0)
    return (
      <div className="text-center text-slate-400 py-10 text-sm">
        Không có dữ liệu biểu đồ
      </div>
    );

  // Tìm giá trị lớn nhất để chia tỷ lệ
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey]) || 0));

  // Tạo các mốc giá trị cho trục Y (0, 25%, 50%, 75%, 100%)
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map((tick) =>
    Math.round(maxValue * tick)
  );

  return (
    <div
      className={`w-full ${height} relative pt-6 pb-8 pl-12 pr-4 text-xs select-none`}
    >
      {/* Lớp nền: Các đường kẻ ngang (Grid lines) & Số trục Y */}
      <div className="absolute inset-0 top-6 bottom-8 left-12 right-4 flex flex-col justify-between pointer-events-none z-0">
        {yAxisTicks.reverse().map((tick, index) => (
          <div
            key={index}
            className="relative w-full border-b border-dashed border-slate-200 h-0"
          >
            <span className="absolute -left-12 -top-2 w-10 text-right text-slate-400 text-[10px]">
              {tick >= 1000000
                ? `${(tick / 1000000).toFixed(1)}M`
                : tick >= 1000
                ? `${(tick / 1000).toFixed(0)}k`
                : tick}
            </span>
          </div>
        ))}
      </div>

      {/* Lớp dữ liệu: Các cột */}
      <div className="relative h-full flex items-end justify-between gap-2 z-10">
        {data.map((item, idx) => {
          const value = Number(item[valueKey]) || 0;
          const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end h-full group relative"
            >
              {/* Tooltip hiển thị khi hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  {value.toLocaleString("vi-VN")}
                </div>
                {/* Mũi tên nhỏ dưới tooltip */}
                <div className="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              {/* Thanh Bar */}
              <div
                className={`w-full max-w-[40px] mx-auto rounded-t-sm transition-all duration-700 ease-out ${color} opacity-90 hover:opacity-100 hover:shadow-md cursor-pointer`}
                style={{ height: `${percent}%`, minHeight: "2px" }}
              ></div>

              {/* Label trục hoành (X-axis) */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <p
                  className="text-[10px] text-slate-500 font-medium truncate px-1"
                  title={item[labelKey]}
                >
                  {item[labelKey]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Biểu đồ tròn (Giữ nguyên logic, chỉ clean code)
export const SimplePieChart = ({
  data,
  labelKey,
  valueKey,
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
}) => {
  if (!data || data.length === 0)
    return (
      <div className="text-center text-slate-400 py-10 text-sm">
        Không có dữ liệu biểu đồ
      </div>
    );

  const total = data.reduce(
    (acc, cur) => acc + (Number(cur[valueKey]) || 0),
    0
  );
  let currentAngle = 0;

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  const gradients = data
    .map((item, index) => {
      const value = Number(item[valueKey]) || 0;
      const percent = (value / total) * 100;
      const start = currentAngle;
      currentAngle += percent;

      const color = colors[index % colors.length];
      return `${color} ${start}% ${currentAngle}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
      <div className="relative w-56 h-56 flex-shrink-0">
        <div
          className="w-full h-full rounded-full shadow-xl border-4 border-white"
          style={{ background: `conic-gradient(${gradients})` }}
        ></div>
        <div className="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-xs text-slate-400 font-medium">Tổng cộng</span>
          <span className="text-sm font-bold text-slate-700">
            {data.length} mục
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-full max-w-md">
        {data.map((item, index) => {
          const value = Number(item[valueKey]) || 0;
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between text-sm border-b border-dashed border-slate-100 pb-1"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span
                  className="font-medium text-slate-700 truncate max-w-[100px]"
                  title={item[labelKey]}
                >
                  {item[labelKey]}
                </span>
              </div>
              <span className="text-slate-500 font-mono text-xs">
                {value.toLocaleString("vi-VN")} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
