import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import useProductService, { type ProductResponse } from "@/services/product";
import useCategoryService from "@/services/category";
import type { Category } from "@/interface/Category";
import ProductTable from "@/components/admin/ProductTable";

const AdminProductList = () => {
  const navigate = useNavigate();
  const { getAllProducts, deleteProduct, searchProducts } = useProductService();
  const { getAllCategories } = useCategoryService();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    thuongHieu: "",
    doiTuong: "",
    loaiNuocHoaId: "",
  });

  // Tạo map category để truyền xuống table cho nhanh (ID -> Tên)
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.tenLoai;
    });
    return map;
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(res.categories);
    };
    fetchCategories();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
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

        {/* GỌI COMPONENT PRODUCT TABLE Ở ĐÂY */}
        <ProductTable
          products={products}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
          categoryMap={categoryMap} // Truyền map tên loại xuống
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductList;
