// Enum trạng thái đơn hàng
export enum OrderStatus {
  CHUA_DUOC_GIAO = "CHUA_DUOC_GIAO",
  DA_GIAO = "DA_GIAO",
  DA_HUY = "DA_HUY",
}

// Chi tiết sản phẩm trong đơn hàng
export interface OrderItem {
  donHang: number;
  nuocHoa: number;
  soLuong: number;
  donGia: number;
  tongTien: number;
}

// Đơn hàng
export interface Order {
  id: number;
  ngayDat: string; // ISO date string
  thanhTien: number;
  phuongThucThanhToan?: string;
  diaChiGiaoHang: string;
  soDienThoai: string;
  ghiChu?: string;
  trangThaiDonHang: OrderStatus;
  thueVAT: number;
  phiVanChuyen: number;
  taiKhoan: number;
  chiTietDonHangs: OrderItem[];
}

// Request cập nhật trạng thái đơn hàng
export interface UpdateOrderStatusRequest {
  id: number;
  trangThaiDonHang: OrderStatus;
}

// Hiển thị trạng thái
export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.CHUA_DUOC_GIAO]: "Chưa giao",
  [OrderStatus.DA_GIAO]: "Đã giao",
  [OrderStatus.DA_HUY]: "Đã hủy",
};

export const OrderStatusColor: Record<OrderStatus, string> = {
  [OrderStatus.CHUA_DUOC_GIAO]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.DA_GIAO]: "bg-green-100 text-green-700",
  [OrderStatus.DA_HUY]: "bg-red-100 text-red-700",
};
