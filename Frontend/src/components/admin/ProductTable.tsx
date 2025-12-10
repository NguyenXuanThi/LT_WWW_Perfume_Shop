import React from "react";
import { type ProductResponse } from "@/services/product";

interface ProductTableProps {
  products: ProductResponse[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
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
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Đối tượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Đánh giá
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
                      <div className="text-sm font-medium text-slate-900">
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
                  {product.giaGoc.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-4">
                  {product.khuyenMai > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      -{product.khuyenMai}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {genderMap[product.doiTuong]}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-yellow-500">★</span>
                    <span className="text-slate-600">
                      {product.mucDanhGia?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(product.id, product.tenSanPham)}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800"
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
    </div>
  );
};

export default ProductTable;
