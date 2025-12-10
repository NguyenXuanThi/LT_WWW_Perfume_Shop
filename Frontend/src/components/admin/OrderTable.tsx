import React from "react";
import {
  type Order,
  OrderStatus,
  OrderStatusLabel,
  OrderStatusColor,
} from "@/interface/Order";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (id: number, newStatus: OrderStatus) => void;
  onDelete: (id: number) => void;
  onView: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  onStatusChange,
  onDelete,
  onView,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 text-center text-sm text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 text-center text-sm text-slate-500">
        Không tìm thấy đơn hàng nào
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Mã ĐH
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(order.ngayDat)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">
                    {order.soDienThoai}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">
                    {order.diaChiGiaoHang}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {order.thanhTien.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.trangThaiDonHang}
                    onChange={(e) =>
                      onStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    disabled={order.trangThaiDonHang === OrderStatus.DA_GIAO}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      OrderStatusColor[order.trangThaiDonHang]
                    } border-0 cursor-pointer disabled:cursor-not-allowed`}
                  >
                    <option value={OrderStatus.CHUA_DUOC_GIAO}>
                      {OrderStatusLabel[OrderStatus.CHUA_DUOC_GIAO]}
                    </option>
                    <option value={OrderStatus.DA_GIAO}>
                      {OrderStatusLabel[OrderStatus.DA_GIAO]}
                    </option>
                    <option value={OrderStatus.DA_HUY}>
                      {OrderStatusLabel[OrderStatus.DA_HUY]}
                    </option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(order)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Xem
                    </button>
                    {order.trangThaiDonHang !== OrderStatus.DA_GIAO && (
                      <button
                        onClick={() => onDelete(order.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
