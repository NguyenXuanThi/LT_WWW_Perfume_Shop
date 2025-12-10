import { useCallback } from "react";
import { useAxios } from "./http";
import type { ApiResponse } from "@/interface/Response";
import type {
  Order,
  UpdateOrderStatusRequest,
  OrderStatus,
} from "@/interface/Order";

export default function useOrderService() {
  const { axiosPrivate } = useAxios();

  const getAllOrders = useCallback(
    async (filters?: {
      trangThai?: OrderStatus;
      startDate?: string;
      endDate?: string;
      taiKhoanId?: number;
    }) => {
      try {
        const params = new URLSearchParams();
        if (filters?.trangThai) params.append("trangThai", filters.trangThai);
        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);
        if (filters?.taiKhoanId)
          params.append("taiKhoanId", filters.taiKhoanId.toString());

        const res = await axiosPrivate.get<ApiResponse<Order[]>>(
          `/admin/donhang?${params.toString()}`
        );
        return { orders: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<Order[]>;
        return {
          orders: [],
          message: data.message || "Lỗi khi tải danh sách đơn hàng",
        };
      }
    },
    [axiosPrivate]
  );

  const getOrderById = useCallback(
    async (id: number) => {
      try {
        const res = await axiosPrivate.get<ApiResponse<Order>>(
          `/admin/donhang/${id}`
        );
        return { order: res.data.body, message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<Order>;
        return {
          order: null,
          message: data.message || "Lỗi khi tải chi tiết đơn hàng",
        };
      }
    },
    [axiosPrivate]
  );

  const updateOrderStatus = useCallback(
    async (id: number, request: UpdateOrderStatusRequest) => {
      try {
        const res = await axiosPrivate.put<ApiResponse<Order>>(
          `/admin/donhang/${id}`,
          request
        );
        return {
          success: true,
          order: res.data.body,
          message: res.data.message,
        };
      } catch (error) {
        const data = error as ApiResponse<Order>;
        return {
          success: false,
          order: null,
          message: data.message || "Lỗi khi cập nhật trạng thái",
        };
      }
    },
    [axiosPrivate]
  );

  const deleteOrder = useCallback(
    async (id: number) => {
      try {
        const res = await axiosPrivate.delete<ApiResponse<void>>(
          `/admin/donhang/${id}`
        );
        return { success: true, message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<void>;
        return {
          success: false,
          message: data.message || "Lỗi khi xóa đơn hàng",
        };
      }
    },
    [axiosPrivate]
  );

  return { getAllOrders, getOrderById, updateOrderStatus, deleteOrder };
}
