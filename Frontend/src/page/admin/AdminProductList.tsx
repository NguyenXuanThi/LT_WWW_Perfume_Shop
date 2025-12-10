import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import useProductService, { type ProductResponse } from "@/services/product";
import useCategoryService from "@/services/category"; // 👈 Import service danh mục
import type { Category } from "@/interface/Category"; // 👈 Import interface

const AdminProductList = () => {
  const navigate = useNavigate();
  const { getAllProducts, deleteProduct, searchProducts } = useProductService();
  const { getAllCategories } = useCategoryService(); // 👈 Lấy hàm load danh mục

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // 👈 State lưu danh mục
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Thêm loaiNuocHoaId vào bộ lọc
  const [filters, setFilters] = useState({
    thuongHieu: "",
    doiTuong: "",
    loaiNuocHoaId: "",
  });

  // 1. Load danh mục khi mới vào trang
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(res.categories);
    };
    fetchCategories();
  }, []);

  // 2. Load sản phẩm (phụ thuộc filters)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Chuyển loaiNuocHoaId sang number nếu có giá trị
      const apiFilters: any = {
        ...filters,
        loaiNuocHoaId: filters.loaiNuocHoaId
          ? Number(filters.loaiNuocHoaId)
          : undefined,
      };

      const { products: data } = await getAllProducts(apiFilters);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, getAllProducts]);

  // Auto-load khi filter thay đổi
  useEffect(() => {
    if (!searchQuery) {
      loadProducts();
    }
  }, [filters]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const { products: data } = await searchProducts(searchQuery);
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;

    setLoading(true);
    try {
      const { success, message } = await deleteProduct(id);
      if (success) {
        alert("Xóa sản phẩm thành công!");
        if (searchQuery) handleSearch();
        else loadProducts();
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Lấy tên loại từ ID (để hiển thị trong bảng)
  const getCategoryName = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.tenLoai : "N/A"; // Hiện tên loại (VD: EDP)
  };

  const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    UNISEX: "Unisex",
  };

  return (
    <AdminLayout title="Quản lý Sản phẩm">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="Tìm kiếm tên, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={() => navigate("/admin/products/new")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
            >
              <span>+</span> Thêm mới
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Đối tượng:</span>
              <select
                value={filters.doiTuong}
                onChange={(e) => {
                  setSearchQuery("");
                  setFilters({ ...filters, doiTuong: e.target.value });
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-red-500 bg-white"
              >
                <option value="">Tất cả</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>

            {/* 🆕 Dropdown Loại sản phẩm */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Loại:</span>
              <select
                value={filters.loaiNuocHoaId}
                onChange={(e) => {
                  setSearchQuery("");
                  setFilters({ ...filters, loaiNuocHoaId: e.target.value });
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-red-500 bg-white min-w-[150px]"
              >
                <option value="">Tất cả loại</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.tenLoai}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {(filters.doiTuong || filters.loaiNuocHoaId || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    thuongHieu: "",
                    doiTuong: "",
                    loaiNuocHoaId: "",
                  });
                }}
                className="text-sm text-red-600 hover:text-red-800 hover:underline px-2 ml-auto"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Thương hiệu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Giá gốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Đối tượng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.hinhAnhChinh || "/placeholder.png"}
                            alt={product.tenSanPham}
                            className="w-12 h-12 rounded object-cover border border-slate-100"
                          />
                          <div>
                            <div
                              className="text-sm font-medium text-slate-900 line-clamp-1"
                              title={product.tenSanPham}
                            >
                              {product.tenSanPham}
                            </div>
                            <div className="text-xs text-slate-500">
                              {product.dungTich}ml
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.thuongHieu || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        <div className="flex flex-col">
                          <span>{product.giaGoc.toLocaleString("vi-VN")}₫</span>
                          {product.khuyenMai > 0 && (
                            <span className="text-[10px] text-red-600 bg-red-50 px-1 rounded w-fit">
                              -{product.khuyenMai}%
                            </span>
                          )}
                        </div>
                      </td>
                      {/* 🆕 Cột hiển thị Loại sản phẩm */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                          {getCategoryName(product.loaiNuocHoa)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {genderMap[product.doiTuong]}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.tenSanPham)
                            }
                            className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductList;
