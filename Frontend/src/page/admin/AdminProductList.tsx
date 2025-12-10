import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import useProductService, { type ProductResponse } from "@/services/product";
import ProductTable from "@/components/admin/ProductTable"; // Import bảng đã tách

const AdminProductList = () => {
  const navigate = useNavigate();
  const { getAllProducts, deleteProduct, searchProducts } = useProductService();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Tách riêng state search và filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    thuongHieu: "",
    doiTuong: "", // "" có nghĩa là Tất cả
  });

  // 1. Hàm load chính, phụ thuộc vào filters hiện tại
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Chỉ gửi param nếu có giá trị
      const apiFilters: any = {};
      if (filters.doiTuong) apiFilters.doiTuong = filters.doiTuong;
      // if(filters.thuongHieu) apiFilters.thuongHieu = filters.thuongHieu; (Nếu sau này có dropdown thương hiệu)

      const { products: data } = await getAllProducts(apiFilters);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, getAllProducts]); // Chạy lại khi filters thay đổi

  // 2. useEffect để Auto-load khi filters thay đổi
  useEffect(() => {
    // Nếu đang có search text thì ưu tiên search, bỏ qua filter dropdown
    if (!searchQuery) {
      loadProducts();
    }
  }, [loadProducts, filters, searchQuery]);
  // Chú ý: logic này ưu tiên flow: Nếu ô tìm kiếm rỗng -> Load theo filter.

  // 3. Xử lý Tìm kiếm riêng
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Nếu xóa trắng ô tìm kiếm -> quay về load theo filter
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
        // Load lại dữ liệu hiện tại (Search hoặc Filter)
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

  return (
    <AdminLayout title="Quản lý Sản phẩm">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Cụm Tìm kiếm & Nút Thêm */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 flex-1 max-w-lg">
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium transition"
                >
                  Tìm kiếm
                </button>
              </div>

              <button
                onClick={() => navigate("/admin/products/new")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium whitespace-nowrap shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>+</span> Thêm mới
              </button>
            </div>
          </div>

          {/* Dòng Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Lọc theo:</span>
              <select
                value={filters.doiTuong}
                onChange={(e) => {
                  setSearchQuery(""); // Reset search khi chọn filter để tránh conflict logic
                  setFilters({ ...filters, doiTuong: e.target.value });
                  // Không cần gọi loadProducts() ở đây nữa, useEffect sẽ lo
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-red-500 cursor-pointer bg-white"
              >
                <option value="">Tất cả đối tượng</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>

            {/* Nút Reset Filter */}
            {(filters.doiTuong || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ thuongHieu: "", doiTuong: "" });
                }}
                className="text-sm text-red-600 hover:text-red-800 hover:underline px-2"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Products Table Component */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductList;
