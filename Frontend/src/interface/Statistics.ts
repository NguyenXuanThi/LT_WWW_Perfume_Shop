import { OrderStatus } from "./Order";

// Thống kê doanh thu theo thời gian
export interface RevenueStatistics {
  label: string; // "2024-01-15", "Tháng 1/2024", "2024"
  doanhThu: number;
  soDonHang: number;
}

// Top sản phẩm bán chạy
export interface TopProduct {
  sanPhamId: number;
  tenSanPham: string;
  hinhAnh: string;
  soLuongBan: number;
  doanhThu: number;
}

// Thống kê theo trạng thái đơn hàng
export interface OrderStatusStatistics {
  trangThai: OrderStatus;
  soDonHang: number;
  tongTien: number;
}

// Tham số cho API thống kê doanh thu
export interface RevenueQueryParams {
  type: "ngay" | "thang" | "nam";
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  year?: number;
  startYear?: number;
  endYear?: number;
}

// Tham số cho API thống kê trạng thái
export interface StatusQueryParams {
  startDate?: string;
  endDate?: string;
}
