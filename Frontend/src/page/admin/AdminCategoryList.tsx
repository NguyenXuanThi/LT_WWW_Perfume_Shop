import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useCategoryService from "@/services/category";
import type { Category, CategoryCreate } from "@/interface/Category";

const AdminCategoryList = () => {
  const { getAllCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryService();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CategoryCreate>({
    tenLoai: "EDP",
    moTa: "",
    nongDoTinhDau: "",
    doLuuHuong: "",
    doToaHuong: "",
  });

  const loadData = async () => {
    setLoading(true);
    const { categories } = await getAllCategories();
    setCategories(categories);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- 1. CẬP NHẬT HÀM VALIDATE ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const tenLoaiClean = formData.tenLoai.trim(); // Cắt khoảng trắng thừa

    // 1. Kiểm tra rỗng
    if (!tenLoaiClean) {
      newErrors.tenLoai = "Tên loại không được để trống.";
    } else {
      // 2. Kiểm tra trùng tên
      // Tìm xem có category nào khác có cùng tên (không phân biệt hoa thường)
      const isDuplicate = categories.some((cat) => {
        // Nếu đang sửa (editingId tồn tại), bỏ qua chính nó
        if (editingId && cat.id === editingId) return false;

        return cat.tenLoai.toLowerCase() === tenLoaiClean.toLowerCase();
      });

      if (isDuplicate) {
        newErrors.tenLoai = "Tên loại này đã tồn tại trong hệ thống.";
      }
    }

    if (!formData.nongDoTinhDau.trim()) {
      newErrors.nongDoTinhDau = "Vui lòng nhập nồng độ tinh dầu.";
    }

    if (!formData.doLuuHuong.trim()) {
      newErrors.doLuuHuong = "Vui lòng nhập độ lưu hương.";
    }

    if (!formData.doToaHuong.trim()) {
      newErrors.doToaHuong = "Vui lòng nhập độ tỏa hương.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let res;
    if (editingId) {
      res = await updateCategory(editingId, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.success) {
      alert(res.message);
      setIsModalOpen(false);
      loadData();
    } else {
      alert(res.message);
    }
  };

  const handleChange = (field: keyof CategoryCreate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa loại này?")) {
      const res = await deleteCategory(id);
      if (res.success) {
        alert(res.message);
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setErrors({});
    setFormData({
      tenLoai: cat.tenLoai || "",
      moTa: cat.moTa || "",
      nongDoTinhDau: cat.nongDoTinhDau || "",
      doLuuHuong: cat.doLuuHuong || "",
      doToaHuong: cat.doToaHuong || "",
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setErrors({});
    setFormData({
      tenLoai: "", // Để rỗng cho người dùng tự nhập thay vì mặc định EDP
      moTa: "",
      nongDoTinhDau: "",
      doLuuHuong: "",
      doToaHuong: "",
    });
    setIsModalOpen(true);
  };

  const getInputClass = (fieldName: string) =>
    `w-full border rounded px-3 py-2 outline-none transition-colors ${
      errors[fieldName]
        ? "border-red-500 bg-red-50 focus:border-red-600"
        : "border-slate-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <AdminLayout title="Quản lý Loại Sản Phẩm">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            Danh sách phân loại
          </h2>
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Thêm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên Loại</th>
                <th className="px-4 py-3">Nồng độ</th>
                <th className="px-4 py-3">Lưu hương</th>
                <th className="px-4 py-3">Tỏa hương</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">#{cat.id}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      {cat.tenLoai}
                    </td>
                    <td className="px-4 py-3">{cat.nongDoTinhDau}</td>
                    <td className="px-4 py-3">{cat.doLuuHuong}</td>
                    <td className="px-4 py-3">{cat.doToaHuong}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && categories.length > 0 && (
          <div className="-mx-6 -mb-6 mt-4 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <div className="text-sm text-slate-600">
              Tổng số lượng phân loại:{" "}
              <span className="font-bold text-slate-900">
                {categories.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={getInputClass("tenLoai")}
                  value={formData.tenLoai}
                  onChange={(e) => handleChange("tenLoai", e.target.value)}
                  placeholder="VD: Body Mist, Hair Mist..."
                />
                {errors.tenLoai && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenLoai}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nồng độ tinh dầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={getInputClass("nongDoTinhDau")}
                  value={formData.nongDoTinhDau}
                  onChange={(e) =>
                    handleChange("nongDoTinhDau", e.target.value)
                  }
                  placeholder="VD: 15-20%"
                />
                {errors.nongDoTinhDau && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nongDoTinhDau}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Độ lưu hương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={getInputClass("doLuuHuong")}
                  value={formData.doLuuHuong}
                  onChange={(e) => handleChange("doLuuHuong", e.target.value)}
                  placeholder="VD: 6-8 giờ"
                />
                {errors.doLuuHuong && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.doLuuHuong}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Độ tỏa hương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={getInputClass("doToaHuong")}
                  value={formData.doToaHuong}
                  onChange={(e) => handleChange("doToaHuong", e.target.value)}
                  placeholder="VD: Trong vòng 1 cánh tay"
                />
                {errors.doToaHuong && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.doToaHuong}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => handleChange("moTa", e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoryList;
