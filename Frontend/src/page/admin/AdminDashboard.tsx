import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatisticsCard from "@/components/admin/StatisticsCard";
import useStatisticsService from "@/services/statistics";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { getOrderStatusStatistics, getTopProducts } = useStatisticsService();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    canceledOrders: 0,
  });

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statusRes = await getOrderStatusStatistics();

        let totalOrders = 0;
        let pendingOrders = 0;
        let totalRevenue = 0;
        let canceledOrders = 0;

        statusRes.data.forEach((item) => {
          totalOrders += item.soDonHang;
          totalRevenue += item.tongTien;
          if (item.trangThai === "CHUA_DUOC_GIAO")
            pendingOrders += item.soDonHang;
          if (item.trangThai === "DA_HUY") canceledOrders += item.soDonHang;
        });

        setStats({ totalOrders, pendingOrders, totalRevenue, canceledOrders });

        const productRes = await getTopProducts(5);
        setTopProducts(productRes.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getOrderStatusStatistics, getTopProducts]);

  return (
    <AdminLayout title="Dashboard">
      {/* Các thẻ thống kê - Đã giảm size icon xuống text-xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard
          title="Doanh thu"
          value={`${stats.totalRevenue.toLocaleString("vi-VN")}₫`}
          icon={<span className="text-xl">💰</span>}
          color="green"
          description="Tổng doanh thu"
        />
        <StatisticsCard
          title="Đơn hàng"
          value={stats.totalOrders}
          icon={<span className="text-xl">📦</span>}
          color="blue"
          description="Tổng đơn hàng"
        />
        <StatisticsCard
          title="Chờ xử lý"
          value={stats.pendingOrders}
          icon={<span className="text-xl">⏳</span>}
          color="yellow"
          description="Đơn hàng cần giao"
        />
        <StatisticsCard
          title="Đã hủy"
          value={stats.canceledOrders}
          icon={<span className="text-xl">🚫</span>}
          color="red"
          description="Đơn hàng bị hủy"
        />
      </div>

      {/* Top sản phẩm & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Top Sản Phẩm Bán Chạy
            </h2>
            <Link
              to="/admin/statistics/top-products"
              className="text-sm text-blue-600 hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-500">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3 text-right">Đã bán</th>
                    <th className="px-4 py-3 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr
                      key={p.sanPhamId}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                            <img
                              src={p.hinhAnh || "/placeholder.png"}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className="truncate max-w-[200px]"
                            title={p.tenSanPham}
                          >
                            {p.tenSanPham}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{p.soLuongBan}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        {p.doanhThu.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Truy cập nhanh
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/products/new"
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition"
            >
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-lg">
                +
              </span>
              <span className="font-medium text-slate-700">
                Thêm sản phẩm mới
              </span>
            </Link>
            <Link
              to="/admin/orders"
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition"
            >
              <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-lg">
                📝
              </span>
              <span className="font-medium text-slate-700">
                Quản lý đơn hàng
              </span>
            </Link>
            <Link
              to="/admin/manage"
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition"
            >
              <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-lg">
                👥
              </span>
              <span className="font-medium text-slate-700">
                Quản lý người dùng
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
