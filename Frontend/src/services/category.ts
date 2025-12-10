import { useCallback } from "react";
import { useAxios } from "./http";
import type { ApiResponse } from "@/interface/Response";
import type { Category, CategoryCreate } from "@/interface/Category";

export default function useCategoryService() {
  const { axiosPrivate } = useAxios();

  const getAllCategories = useCallback(async () => {
    try {
      const res = await axiosPrivate.get<ApiResponse<Category[]>>(
        "/admin/loainuochoa"
      );
      return { categories: res.data.body || [], message: res.data.message };
    } catch (error) {
      return { categories: [], message: "Lỗi tải danh mục" };
    }
  }, [axiosPrivate]);

  const createCategory = useCallback(
    async (data: CategoryCreate) => {
      try {
        const res = await axiosPrivate.post<ApiResponse<Category>>(
          "/admin/loainuochoa",
          data
        );
        return { success: true, message: res.data.message };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || "Lỗi thêm danh mục",
        };
      }
    },
    [axiosPrivate]
  );

  const updateCategory = useCallback(
    async (id: number, data: CategoryCreate) => {
      try {
        const res = await axiosPrivate.put<ApiResponse<Category>>(
          `/admin/loainuochoa/${id}`,
          data
        );
        return { success: true, message: res.data.message };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || "Lỗi cập nhật",
        };
      }
    },
    [axiosPrivate]
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      try {
        const res = await axiosPrivate.delete<ApiResponse<void>>(
          `/admin/loainuochoa/${id}`
        );
        return { success: true, message: res.data.message };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || "Lỗi xóa danh mục",
        };
      }
    },
    [axiosPrivate]
  );

  return { getAllCategories, createCategory, updateCategory, deleteCategory };
}
