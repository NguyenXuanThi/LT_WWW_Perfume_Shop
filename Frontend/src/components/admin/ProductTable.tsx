import React from "react";
import { type ProductResponse } from "@/services/product";

interface ProductTableProps {
  products: ProductResponse[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  // Thêm map loại sản phẩm nếu muốn hiển thị tên loại trong component con
  categoryMap?: Record<number, string>;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  categoryMap = {}, // Mặc định là object rỗng
}) => {
  const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    UNISEX: "Unisex",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 text-center text-sm text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 text-center text-sm text-slate-500">
        Không tìm thấy sản phẩm nào
      </div>
    );
  }

  return (
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
            {products.map((product) => (
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
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                    {categoryMap[product.loaiNuocHoa] || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {genderMap[product.doiTuong]}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(product.id, product.tenSanPham)}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER HIỂN THỊ SỐ LƯỢNG */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="text-sm text-slate-600">
          Tổng số lượng sản phẩm:{" "}
          <span className="font-bold text-slate-900">{products.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
