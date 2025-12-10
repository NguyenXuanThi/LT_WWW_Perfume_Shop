import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useOrderService from "@/services/order";
import {
  type Order,
  OrderStatus,
  type UpdateOrderStatusRequest,
} from "@/interface/Order";
import OrderTable from "@/components/admin/OrderTable";

const AdminOrderList = () => {
  const { getAllOrders, updateOrderStatus, deleteOrder } = useOrderService();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    trangThai: "" as OrderStatus | "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {
        ...(filters.trangThai && { trangThai: filters.trangThai }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };
      const { orders: data } = await getAllOrders(filterParams);
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, getAllOrders]);

  const handleApplyFilters = () => {
    loadOrders();
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    if (!confirm(`Bạn có chắc muốn thay đổi trạng thái đơn hàng #${orderId}?`))
      return;

    setLoading(true);
    try {
      const request: UpdateOrderStatusRequest = {
        id: orderId,
        trangThaiDonHang: newStatus,
      };
      const { success, message } = await updateOrderStatus(orderId, request);
      if (success) {
        alert("Cập nhật trạng thái thành công!");
        loadOrders();
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: number) => {
    if (
      !confirm(
        `Bạn có chắc muốn xóa đơn hàng #${orderId}? Chỉ có thể xóa đơn đã hủy hoặc chưa giao.`
      )
    )
      return;

    setLoading(true);
    try {
      const { success, message } = await deleteOrder(orderId);
      if (success) {
        alert("Xóa đơn hàng thành công!");
        loadOrders();
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Lỗi khi xóa đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Quản lý Đơn hàng">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.trangThai}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    trangThai: e.target.value as OrderStatus | "",
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Tất cả</option>
                <option value={OrderStatus.CHUA_DUOC_GIAO}>Chưa giao</option>
                <option value={OrderStatus.DA_GIAO}>Đã giao</option>
                <option value={OrderStatus.DA_HUY}>Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Lọc
              </button>
              <button
                onClick={() => {
                  setFilters({ trangThai: "", startDate: "", endDate: "" });
                  loadOrders();
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          loading={loading}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onView={setSelectedOrder}
        />

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Chi tiết đơn hàng #{selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      Thông tin khách hàng
                    </h3>
                    <p className="text-sm text-slate-600">
                      Số điện thoại: {selectedOrder.soDienThoai}
                    </p>
                    <p className="text-sm text-slate-600">
                      Địa chỉ: {selectedOrder.diaChiGiaoHang}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      Chi tiết đơn hàng
                    </h3>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Sản phẩm</th>
                          <th className="px-4 py-2 text-right">SL</th>
                          <th className="px-4 py-2 text-right">Đơn giá</th>
                          <th className="px-4 py-2 text-right">Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.chiTietDonHangs.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">SP #{item.nuocHoa}</td>
                            <td className="px-4 py-2 text-right">
                              {item.soLuong}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.donGia.toLocaleString("vi-VN")}₫
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.tongTien.toLocaleString("vi-VN")}₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Thuế VAT:</span>
                      <span className="font-medium">
                        {selectedOrder.thueVAT.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Phí vận chuyển:</span>
                      <span className="font-medium">
                        {selectedOrder.phiVanChuyen.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">
                        {selectedOrder.thanhTien.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrderList;
