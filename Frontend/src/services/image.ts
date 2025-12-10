import { useAxios } from "./http";
import type { ApiResponse } from "@/interface/Response";

export default function useImageService() {
  const { axiosPrivate } = useAxios();

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("hinhAnhFile", file);

    try {
      const res = await axiosPrivate.post<ApiResponse<string>>(
        "/images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Trả về chuỗi: "https://url_anh?public_id"
      return { url: res.data.body, message: res.data.message };
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return { url: null, message: "Lỗi upload ảnh" };
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      const res = await axiosPrivate.delete<ApiResponse<boolean>>(
        `/images/delete?id=${publicId}`
      );
      return { success: res.data.body };
    } catch (error) {
      return { success: false };
    }
  };

  return { uploadImage, deleteImage };
}
