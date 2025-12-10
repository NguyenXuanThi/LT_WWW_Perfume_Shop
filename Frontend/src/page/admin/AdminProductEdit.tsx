import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import useProductService, {
  type ProductCreateRequest,
  type ProductUpdateRequest,
} from "@/services/product";
import useImageService from "@/services/image";
import useCategoryService from "@/services/category"; // 1. Import Service Category
import type { Category } from "@/interface/Category"; // 2. Import Interface

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct } = useProductService();
  const { uploadImage, deleteImage } = useImageService();
  const { getAllCategories } = useCategoryService(); // 3. Sử dụng hook

  const isEditMode = !!id && id !== "new";
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 4. State lưu danh sách loại nước hoa lấy từ API
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<ProductCreateRequest>({
    tenSanPham: "",
    thuongHieu: "",
    giaGoc: 0,
    khuyenMai: 0,
    hinhAnhChinh: "",
    dungTich: 0,
    doiTuong: "MALE",
    loaiNuocHoa: 1, // Mặc định ID 1, sẽ update khi load xong danh mục nếu cần
    chiTietNuocHoa: {
      hinhAnhChiTiet: [],
      xuatXu: "",
      namPhatHanh: new Date().getFullYear(),
      nhomHuong: "",
      phongCachMuiHuong: "",
      moTa: "",
    },
  });

  // 5. Load danh sách loại nước hoa ngay khi vào trang
  useEffect(() => {
    const fetchCategories = async () => {
      const { categories } = await getAllCategories();
      setCategories(categories);

      // Nếu là thêm mới và chưa chọn loại nào, set mặc định là loại đầu tiên trong list
      if (!isEditMode && categories.length > 0) {
        setFormData((prev) => ({ ...prev, loaiNuocHoa: categories[0].id }));
      }
    };
    fetchCategories();
  }, []); // Chạy 1 lần

  // Load thông tin sản phẩm (nếu là sửa)
  useEffect(() => {
    if (isEditMode) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { product } = await getProductById(Number(id));
      if (product) {
        setFormData({
          tenSanPham: product.tenSanPham,
          thuongHieu: product.thuongHieu || "",
          giaGoc: product.giaGoc,
          khuyenMai: product.khuyenMai,
          hinhAnhChinh: product.hinhAnhChinh || "",
          dungTich: product.dungTich,
          doiTuong: product.doiTuong,
          loaiNuocHoa: product.loaiNuocHoa, // Backend trả về ID loại
          chiTietNuocHoa: {
            hinhAnhChiTiet: product.chiTietNuocHoa?.hinhAnhChiTiet || [],
            xuatXu: product.chiTietNuocHoa?.xuatXu || "",
            namPhatHanh:
              product.chiTietNuocHoa?.namPhatHanh || new Date().getFullYear(),
            nhomHuong: product.chiTietNuocHoa?.nhomHuong || "",
            phongCachMuiHuong: product.chiTietNuocHoa?.phongCachMuiHuong || "",
            moTa: product.chiTietNuocHoa?.moTa || "",
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ ẢNH (Giữ nguyên như cũ) ---
  const getDisplayUrl = (combinedString?: string) =>
    combinedString ? combinedString.split("?")[0] : "";
  const getPublicId = (combinedString?: string) =>
    combinedString && combinedString.includes("?")
      ? combinedString.split("?")[1]
      : "";

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const { url } = await uploadImage(e.target.files[0]);
      if (url) {
        if (formData.hinhAnhChinh) {
          const oldId = getPublicId(formData.hinhAnhChinh);
          if (oldId) await deleteImage(oldId);
        }
        setFormData((prev) => ({ ...prev, hinhAnhChinh: url }));
      }
      setUploading(false);
    }
  };

  const handleDetailImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setUploading(true);
      const newImages: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const { url } = await uploadImage(e.target.files[i]);
        if (url) newImages.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        chiTietNuocHoa: {
          ...prev.chiTietNuocHoa,
          hinhAnhChiTiet: [
            ...(prev.chiTietNuocHoa.hinhAnhChiTiet || []),
            ...newImages,
          ],
        },
      }));
      setUploading(false);
    }
  };

  const removeDetailImage = async (indexToRemove: number) => {
    const imageToRemove =
      formData.chiTietNuocHoa.hinhAnhChiTiet?.[indexToRemove];
    if (!imageToRemove) return;
    const newGallery = formData.chiTietNuocHoa.hinhAnhChiTiet?.filter(
      (_, idx) => idx !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      chiTietNuocHoa: { ...prev.chiTietNuocHoa, hinhAnhChiTiet: newGallery },
    }));
    const publicId = getPublicId(imageToRemove);
    if (publicId) await deleteImage(publicId);
  };
  // --- KẾT THÚC XỬ LÝ ẢNH ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        const updateData: ProductUpdateRequest = {
          ...formData,
          id: Number(id),
          chiTietNuocHoa: { ...formData.chiTietNuocHoa, nuocHoaId: Number(id) },
        };
        const { success, message } = await updateProduct(
          Number(id),
          updateData
        );
        if (success) {
          alert("Cập nhật thành công!");
          navigate("/admin/products");
        } else alert(message);
      } else {
        const { success, message } = await createProduct(formData);
        if (success) {
          alert("Thêm mới thành công!");
          navigate("/admin/products");
        } else alert(message);
      }
    } catch (error) {
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      chiTietNuocHoa: { ...prev.chiTietNuocHoa, [field]: value },
    }));
  };

  return (
    <AdminLayout
      title={isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-5xl mx-auto pb-10"
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột trái: Ảnh đại diện */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ảnh đại diện
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-2 h-64 flex flex-col items-center justify-center bg-slate-50 relative group hover:border-red-400 transition-colors">
                {formData.hinhAnhChinh ? (
                  <img
                    src={getDisplayUrl(formData.hinhAnhChinh)}
                    alt="Main"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <span className="text-4xl block mb-2">📷</span>
                    <span className="text-xs">Chưa có ảnh</span>
                  </div>
                )}

                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                  <span className="text-white text-sm font-medium bg-red-600 px-3 py-1.5 rounded-full">
                    Thay đổi ảnh
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 animate-pulse">
                      Đang tải...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Form nhập liệu */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tenSanPham}
                  onChange={(e) => handleChange("tenSanPham", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={formData.thuongHieu}
                  onChange={(e) => handleChange("thuongHieu", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none"
                />
              </div>

              {/* 6. PHẦN QUAN TRỌNG: Dropdown Loại nước hoa ĐỘNG */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loại nước hoa *
                </label>
                <select
                  required
                  value={formData.loaiNuocHoa}
                  onChange={(e) =>
                    handleChange("loaiNuocHoa", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md outline-none bg-white cursor-pointer"
                >
                  {categories.length === 0 && (
                    <option value="">Đang tải danh mục...</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.tenLoai}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giá gốc (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.giaGoc}
                  onChange={(e) =>
                    handleChange("giaGoc", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.khuyenMai}
                  onChange={(e) =>
                    handleChange("khuyenMai", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dung tích (ml)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.dungTich}
                  onChange={(e) =>
                    handleChange("dungTich", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Đối tượng
                </label>
                <select
                  required
                  value={formData.doiTuong}
                  onChange={(e) => handleChange("doiTuong", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md outline-none bg-white"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2 & 3: GIỮ NGUYÊN CODE CŨ */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Album ảnh chi tiết
          </h2>
          <div className="mb-4">
            <label className="inline-block cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition">
              <span>+ Thêm ảnh chi tiết</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleDetailImagesUpload}
                className="hidden"
              />
            </label>
            <span className="ml-3 text-xs text-slate-500">
              Giữ Ctrl để chọn nhiều ảnh
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {formData.chiTietNuocHoa.hinhAnhChiTiet?.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square border border-slate-200 rounded-lg overflow-hidden group"
              >
                <img
                  src={getDisplayUrl(img)}
                  alt={`Detail ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeDetailImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Mô tả chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Xuất xứ
              </label>
              <input
                type="text"
                value={formData.chiTietNuocHoa.xuatXu}
                onChange={(e) => handleDetailChange("xuatXu", e.target.value)}
                className="w-full px-3 py-2 border rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Năm phát hành
              </label>
              <input
                type="number"
                value={formData.chiTietNuocHoa.namPhatHanh}
                onChange={(e) =>
                  handleDetailChange("namPhatHanh", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nhóm hương
              </label>
              <input
                type="text"
                value={formData.chiTietNuocHoa.nhomHuong}
                onChange={(e) =>
                  handleDetailChange("nhomHuong", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phong cách
              </label>
              <input
                type="text"
                value={formData.chiTietNuocHoa.phongCachMuiHuong}
                onChange={(e) =>
                  handleDetailChange("phongCachMuiHuong", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                rows={5}
                value={formData.chiTietNuocHoa.moTa}
                onChange={(e) => handleDetailChange("moTa", e.target.value)}
                className="w-full px-3 py-2 border rounded-md outline-none resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white/90 p-4 border-t backdrop-blur-sm shadow-lg rounded-t-lg">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading
              ? "Đang lưu..."
              : isEditMode
              ? "Cập nhật sản phẩm"
              : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProductEdit;
