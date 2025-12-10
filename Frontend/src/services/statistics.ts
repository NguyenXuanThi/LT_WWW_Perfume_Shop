import { useCallback } from "react";
import { useAxios } from "./http";
import type { ApiResponse } from "@/interface/Response";
import type {
  RevenueStatistics,
  TopProduct,
  OrderStatusStatistics,
  RevenueQueryParams,
  StatusQueryParams,
} from "@/interface/Statistics";

export default function useStatisticsService() {
  const { axiosPrivate } = useAxios();

  const getRevenueStatistics = useCallback(
    async (params: RevenueQueryParams) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("type", params.type);

        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.year) queryParams.append("year", params.year.toString());
        if (params.startYear)
          queryParams.append("startYear", params.startYear.toString());
        if (params.endYear)
          queryParams.append("endYear", params.endYear.toString());

        const res = await axiosPrivate.get<ApiResponse<RevenueStatistics[]>>(
          `/admin/thongke/doanhthu?${queryParams.toString()}`
        );
        return { data: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<RevenueStatistics[]>;
        return {
          data: [],
          message: data.message || "Lỗi khi tải thống kê doanh thu",
        };
      }
    },
    [axiosPrivate]
  );

  const exportRevenueStatistics = useCallback(
    async (params: RevenueQueryParams) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("type", params.type);

        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.year) queryParams.append("year", params.year.toString());
        if (params.startYear)
          queryParams.append("startYear", params.startYear.toString());
        if (params.endYear)
          queryParams.append("endYear", params.endYear.toString());

        const res = await axiosPrivate.get(
          `/admin/thongke/doanhthu/export?${queryParams.toString()}`,
          { responseType: "blob" }
        );

        // Download file
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `ThongKeDoanhThu_${params.type}_${new Date().getTime()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true, message: "Xuất file thành công" };
      } catch (error) {
        return { success: false, message: "Lỗi khi xuất file" };
      }
    },
    [axiosPrivate]
  );

  const getTopProducts = useCallback(
    async (limit: number = 10) => {
      try {
        const res = await axiosPrivate.get<ApiResponse<TopProduct[]>>(
          `/admin/thongke/sanpham/top?limit=${limit}`
        );
        return { data: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<TopProduct[]>;
        return {
          data: [],
          message: data.message || "Lỗi khi tải top sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const exportTopProducts = useCallback(
    async (limit: number = 10) => {
      try {
        const res = await axiosPrivate.get(
          `/admin/thongke/sanpham/top/export?limit=${limit}`,
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `TopSanPham_${new Date().getTime()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true, message: "Xuất file thành công" };
      } catch (error) {
        return { success: false, message: "Lỗi khi xuất file" };
      }
    },
    [axiosPrivate]
  );

  const getOrderStatusStatistics = useCallback(
    async (params?: StatusQueryParams) => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.startDate)
          queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);

        const queryString = queryParams.toString();
        const url = `/admin/thongke/trangthai${
          queryString ? `?${queryString}` : ""
        }`;

        const res = await axiosPrivate.get<
          ApiResponse<OrderStatusStatistics[]>
        >(url);
        return { data: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<OrderStatusStatistics[]>;
        return {
          data: [],
          message: data.message || "Lỗi khi tải thống kê trạng thái",
        };
      }
    },
    [axiosPrivate]
  );

  const exportOrderStatusStatistics = useCallback(
    async (params?: StatusQueryParams) => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.startDate)
          queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);

        const queryString = queryParams.toString();
        const url = `/admin/thongke/trangthai/export${
          queryString ? `?${queryString}` : ""
        }`;

        const res = await axiosPrivate.get(url, { responseType: "blob" });

        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `ThongKeTrangThai_${new Date().getTime()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true, message: "Xuất file thành công" };
      } catch (error) {
        return { success: false, message: "Lỗi khi xuất file" };
      }
    },
    [axiosPrivate]
  );

  return {
    getRevenueStatistics,
    exportRevenueStatistics,
    getTopProducts,
    exportTopProducts,
    getOrderStatusStatistics,
    exportOrderStatusStatistics,
  };
}
