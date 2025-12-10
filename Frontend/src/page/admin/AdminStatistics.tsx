import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import useStatisticsService from "@/services/statistics";
import {
  SimpleBarChart,
  SimplePieChart,
} from "@/components/admin/SimpleCharts";
import { OrderStatusLabel } from "@/interface/Order";

const AdminStatistics = () => {
  const { type } = useParams<{ type: string }>(); // Lấy type từ URL: 'revenue', 'top-products', 'orders'
  const {
    getRevenueStatistics,
    exportRevenueStatistics,
    getTopProducts,
    exportTopProducts,
    getOrderStatusStatistics,
    exportOrderStatusStatistics,
  } = useStatisticsService();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters cho Doanh thu & Đơn hàng
  const [viewMode, setViewMode] = useState<"ngay" | "thang" | "nam">("thang");
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reset data khi chuyển tab menu
  useEffect(() => {
    setData([]);
    setLoading(false);
    // Reset filters mặc định khi đổi loại thống kê
    if (type === "revenue") setViewMode("thang");
  }, [type]);

  useEffect(() => {
    loadData();
  }, [type, viewMode, year]); // Load lại khi filter chính thay đổi (với 'ngay' thì cần bấm nút xem)

  const loadData = async () => {
    setLoading(true);
    try {
      if (type === "revenue") {
        const params: any = { type: viewMode };
        if (viewMode === "thang") params.year = year;
        if (viewMode === "nam") {
          params.startYear = year - 4;
          params.endYear = year;
        }
        if (viewMode === "ngay") {
          if (!startDate || !endDate) {
            setLoading(false);
            return;
          }
          params.startDate = startDate;
          params.endDate = endDate;
        }
        const res = await getRevenueStatistics(params);
        setData(res.data);
      } else if (type === "top-products") {
        const res = await getTopProducts(10); // Lấy top 10
        setData(res.data);
      } else if (type === "orders") {
        const params: any = {};
        if (startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }
        const res = await getOrderStatusStatistics(params);
        // Map lại label cho đẹp (Enum -> Tiếng Việt)
        const mappedData = res.data.map((item) => ({
          ...item,
          label: OrderStatusLabel[item.trangThai] || item.trangThai,
        }));
        setData(mappedData);
      }
    } catch (error) {
      console.error("Lỗi load dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (type === "revenue") {
      const params: any = { type: viewMode };
      if (viewMode === "thang") params.year = year;
      if (viewMode === "nam") {
        params.startYear = year - 4;
        params.endYear = year;
      }
      if (viewMode === "ngay") {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      await exportRevenueStatistics(params);
    } else if (type === "top-products") {
      await exportTopProducts(10);
    } else if (type === "orders") {
      const params: any = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      await exportOrderStatusStatistics(params);
    }
  };

  // --- RENDER SECTIONS ---

  // 1. Render Filters & Header
  const renderHeader = () => {
    let title = "";
    let filters = null;

    switch (type) {
      case "revenue":
        title = "Thống Kê Doanh Thu";
        filters = (
          <div className="flex flex-wrap items-end gap-3 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1">
                Xem theo
              </span>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="border rounded px-2 py-1.5 outline-none focus:border-red-500"
              >
                <option value="ngay">Theo Ngày</option>
                <option value="thang">Theo Tháng</option>
                <option value="nam">Theo Năm</option>
              </select>
            </div>
            {viewMode === "thang" && (
              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-1">
                  Năm
                </span>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border rounded px-2 py-1.5 w-20"
                />
              </div>
            )}
            {viewMode === "ngay" && (
              <>
                <div>
                  <span className="block text-xs font-semibold text-slate-500 mb-1">
                    Từ ngày
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-2 py-1.5"
                  />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-500 mb-1">
                    Đến ngày
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-2 py-1.5"
                  />
                </div>
                <button
                  onClick={loadData}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Xem
                </button>
              </>
            )}
          </div>
        );
        break;
      case "top-products":
        title = "Top Sản Phẩm Bán Chạy";
        filters = (
          <div className="text-sm text-slate-500 italic">
            Top 10 sản phẩm có doanh thu cao nhất.
          </div>
        );
        break;
      case "orders":
        title = "Thống Kê Đơn Hàng";
        filters = (
          <div className="flex flex-wrap items-end gap-3 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1">
                Từ ngày
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1.5"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1">
                Đến ngày
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1.5"
              />
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lọc
            </button>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                loadData();
              }}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded hover:bg-slate-50"
            >
              Tất cả
            </button>
          </div>
        );
        break;
      default:
        return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm"
          >
            <span>📥</span> Xuất Excel
          </button>
        </div>
        {filters}
      </div>
    );
  };

  // 2. Render Table
  const renderTable = () => {
    if (loading)
      return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    if (!data || data.length === 0)
      return (
        <div className="text-center py-8 text-slate-500">
          Không có dữ liệu hiển thị.
        </div>
      );

    if (type === "revenue") {
      return (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b">Thời gian</th>
              <th className="px-4 py-3 border-b text-center">Số đơn hàng</th>
              <th className="px-4 py-3 border-b text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{item.label}</td>
                <td className="px-4 py-3 text-center">{item.soDonHang}</td>
                <td className="px-4 py-3 text-right font-bold text-green-700">
                  {item.doanhThu?.toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === "top-products") {
      return (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b">Hạng</th>
              <th className="px-4 py-3 border-b">Sản phẩm</th>
              <th className="px-4 py-3 border-b text-right">Đã bán</th>
              <th className="px-4 py-3 border-b text-right">Tổng thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-500">
                  #{idx + 1}
                </td>
                <td className="px-4 py-3 font-medium">{item.tenSanPham}</td>
                <td className="px-4 py-3 text-right">{item.soLuongBan}</td>
                <td className="px-4 py-3 text-right font-bold text-green-700">
                  {item.doanhThu?.toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === "orders") {
      return (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b">Trạng thái</th>
              <th className="px-4 py-3 border-b text-center">Số lượng đơn</th>
              <th className="px-4 py-3 border-b text-right">Tổng giá trị</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.label}
                </td>
                <td className="px-4 py-3 text-center">{item.soDonHang}</td>
                <td className="px-4 py-3 text-right font-bold text-green-700">
                  {item.tongTien?.toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  // 3. Render Chart
  const renderChart = () => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-blue-500 pl-3">
          Biểu Đồ Trực Quan
        </h3>

        {/* Chọn loại biểu đồ dựa trên loại thống kê */}
        {type === "revenue" && (
          <SimpleBarChart
            data={data}
            labelKey="label"
            valueKey="doanhThu"
            color="bg-green-500"
          />
        )}

        {type === "top-products" && (
          <SimpleBarChart
            data={data}
            labelKey="tenSanPham"
            valueKey="doanhThu"
            color="bg-blue-500"
          />
        )}

        {type === "orders" && (
          <SimplePieChart data={data} labelKey="label" valueKey="soDonHang" />
        )}
      </div>
    );
  };

  return (
    <AdminLayout title="Thống Kê">
      {renderHeader()}

      {/* Nội dung chính: Bảng trước, Biểu đồ sau */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">{renderTable()}</div>
      </div>

      {renderChart()}
    </AdminLayout>
  );
};

export default AdminStatistics;
