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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setFormData({
      tenLoai: cat.tenLoai,
      moTa: cat.moTa,
      nongDoTinhDau: cat.nongDoTinhDau,
      doLuuHuong: cat.doLuuHuong,
      doToaHuong: cat.doToaHuong,
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      tenLoai: "EDP",
      moTa: "",
      nongDoTinhDau: "",
      doLuuHuong: "",
      doToaHuong: "",
    });
    setIsModalOpen(true);
  };

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
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên loại (VD: Body Mist, Hair Mist...)
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.tenLoai}
                  onChange={(e) =>
                    setFormData({ ...formData, tenLoai: e.target.value })
                  }
                  placeholder="Nhập tên loại sản phẩm..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nồng độ tinh dầu
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.nongDoTinhDau}
                  onChange={(e) =>
                    setFormData({ ...formData, nongDoTinhDau: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Độ lưu hương
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.doLuuHuong}
                  onChange={(e) =>
                    setFormData({ ...formData, doLuuHuong: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Độ tỏa hương
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.doToaHuong}
                  onChange={(e) =>
                    setFormData({ ...formData, doToaHuong: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
