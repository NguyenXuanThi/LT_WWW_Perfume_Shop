import { useCallback } from "react";
import { useAxios } from "./http";
import type { ApiResponse } from "@/interface/Response";

export interface ProductCreateRequest {
  tenSanPham: string;
  thuongHieu?: string;
  giaGoc: number;
  khuyenMai: number;
  hinhAnhChinh?: string;
  dungTich: number;
  doiTuong: "MALE" | "FEMALE" | "UNISEX";
  loaiNuocHoa: number;
  chiTietNuocHoa: {
    hinhAnhChiTiet?: string[];
    xuatXu?: string;
    namPhatHanh: number;
    nhomHuong?: string;
    phongCachMuiHuong?: string;
    moTa?: string;
  };
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  id: number;
  chiTietNuocHoa: {
    nuocHoaId: number;
    hinhAnhChiTiet?: string[];
    xuatXu?: string;
    namPhatHanh: number;
    nhomHuong?: string;
    phongCachMuiHuong?: string;
    moTa?: string;
  };
}

export interface ProductResponse {
  id: number;
  tenSanPham: string;
  thuongHieu?: string;
  giaGoc: number;
  khuyenMai: number;
  hinhAnhChinh?: string;
  dungTich: number;
  doiTuong: "MALE" | "FEMALE" | "UNISEX";
  loaiNuocHoa: number;
  mucDanhGia: number;
  chiTietNuocHoa: {
    nuocHoaId: number;
    hinhAnhChiTiet?: string[];
    xuatXu?: string;
    namPhatHanh: number;
    nhomHuong?: string;
    phongCachMuiHuong?: string;
    moTa?: string;
  };
}

export default function useProductService() {
  const { axiosPrivate } = useAxios();

  const getAllProducts = useCallback(
    async (filters?: {
      tenSanPham?: string;
      thuongHieu?: string;
      doiTuong?: string;
      loaiNuocHoaId?: number;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      try {
        const params = new URLSearchParams();
        if (filters?.tenSanPham)
          params.append("tenSanPham", filters.tenSanPham);
        if (filters?.thuongHieu)
          params.append("thuongHieu", filters.thuongHieu);
        if (filters?.doiTuong) params.append("doiTuong", filters.doiTuong);
        if (filters?.loaiNuocHoaId)
          params.append("loaiNuocHoaId", filters.loaiNuocHoaId.toString());
        if (filters?.minPrice)
          params.append("minPrice", filters.minPrice.toString());
        if (filters?.maxPrice)
          params.append("maxPrice", filters.maxPrice.toString());

        const queryString = params.toString();
        const url = `/admin/nuochoa${queryString ? `?${queryString}` : ""}`;

        const res = await axiosPrivate.get<ApiResponse<ProductResponse[]>>(url);
        return { products: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<ProductResponse[]>;
        return {
          products: [],
          message: data.message || "Lỗi khi tải danh sách sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const getProductById = useCallback(
    async (id: number) => {
      try {
        const res = await axiosPrivate.get<ApiResponse<ProductResponse>>(
          `/admin/nuochoa/${id}`
        );
        return { product: res.data.body, message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<ProductResponse>;
        return {
          product: null,
          message: data.message || "Lỗi khi tải thông tin sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const createProduct = useCallback(
    async (product: ProductCreateRequest) => {
      try {
        const res = await axiosPrivate.post<ApiResponse<ProductResponse>>(
          "/admin/nuochoa",
          product
        );
        return {
          success: true,
          product: res.data.body,
          message: res.data.message,
        };
      } catch (error) {
        const data = error as ApiResponse<ProductResponse>;
        return {
          success: false,
          product: null,
          message: data.message || "Lỗi khi tạo sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const updateProduct = useCallback(
    async (id: number, product: ProductUpdateRequest) => {
      try {
        const res = await axiosPrivate.put<ApiResponse<ProductResponse>>(
          `/admin/nuochoa/${id}`,
          product
        );
        return {
          success: true,
          product: res.data.body,
          message: res.data.message,
        };
      } catch (error) {
        const data = error as ApiResponse<ProductResponse>;
        return {
          success: false,
          product: null,
          message: data.message || "Lỗi khi cập nhật sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        const res = await axiosPrivate.delete<ApiResponse<void>>(
          `/admin/nuochoa/${id}`
        );
        return { success: true, message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<void>;
        return {
          success: false,
          message: data.message || "Lỗi khi xóa sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  const searchProducts = useCallback(
    async (keyword: string) => {
      try {
        const res = await axiosPrivate.get<ApiResponse<ProductResponse[]>>(
          `/admin/nuochoa/search?keyword=${keyword}`
        );
        return { products: res.data.body || [], message: res.data.message };
      } catch (error) {
        const data = error as ApiResponse<ProductResponse[]>;
        return {
          products: [],
          message: data.message || "Lỗi khi tìm kiếm sản phẩm",
        };
      }
    },
    [axiosPrivate]
  );

  return {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
  };
}
