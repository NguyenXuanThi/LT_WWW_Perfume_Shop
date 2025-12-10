import { useState, useEffect, useCallback } from "react";
import { type User, type TenVaiTro } from "@/interface/User";
import useUserService from "@/services/user";
import UserRow from "@/components/admin/UserRow";
import AdminLayout from "@/components/admin/AdminLayout"; // Import AdminLayout

// Constants cho filter
const ROLES = ["Customer", "Admin", ""];
const STATUSES = ["Active", "Inactive", ""];

const AdminUserManagement = () => {
  const { getTaiKhoanPage, changeActive } = useUserService();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUSES[0]);

  const fetchUsers = useCallback(
    async (page: number, search: string, role: string, status: string) => {
      setLoading(true);
      setError(null);

      let statusFilter: boolean | undefined;
      if (status === "Active") statusFilter = true;
      else if (status === "Inactive") statusFilter = false;

      let roleFilter: string | undefined = role === "" ? undefined : role;

      try {
        const result = await getTaiKhoanPage(
          page,
          search === "" ? undefined : search,
          roleFilter,
          statusFilter
        );

        if (result.content) {
          // @ts-ignore: Tạm thời ignore lỗi type UserAdminOnly nếu interface chưa cập nhật
          setUsers(result.content);
          setTotalPages(result.totalPages);
        } else if (result.message) {
          setError(result.message);
        }
      } catch (err) {
        setError("Lỗi kết nối hoặc hệ thống.");
      } finally {
        setLoading(false);
      }
    },
    [getTaiKhoanPage]
  );

  useEffect(() => {
    if (currentPage !== 0 && (searchQuery || selectedRole || selectedStatus)) {
      setCurrentPage(0);
      return;
    }
    fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
  }, [currentPage, searchQuery, selectedRole, selectedStatus, fetchUsers]);

  const handleToggleStatus = async (
    email: string,
    currentStatus: boolean,
    vaiTro: TenVaiTro
  ) => {
    if (vaiTro === "Admin") {
      alert("Không thể thay đổi trạng thái hoạt động của tài khoản Admin.");
      return;
    }

    const newStatus = !currentStatus;
    const action = newStatus ? "kích hoạt" : "vô hiệu hóa";

    if (confirm(`Bạn có chắc muốn ${action} tài khoản ${email} không?`)) {
      setLoading(true);
      try {
        const { success, message } = await changeActive(
          email,
          newStatus,
          vaiTro
        );

        if (success) {
          setUsers((prev) =>
            prev.map((u) =>
              u.email === email ? { ...u, active: newStatus } : u
            )
          );
          alert(
            `${
              action.charAt(0).toUpperCase() + action.slice(1)
            } tài khoản ${email} thành công!`
          );
        } else {
          alert(
            `Thao tác thất bại: ${message || "Đã xảy ra lỗi không xác định."}`
          );
        }
      } catch (err) {
        alert("Lỗi hệ thống khi cố gắng thay đổi trạng thái.");
      } finally {
        setLoading(false);
      }
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <AdminLayout title="Quản lý Người dùng">
      <div className="space-y-6">
        {/* Filter Bar - Giao diện đồng bộ với AdminProductList */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm Tên hoặc Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Tất cả Vai trò</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Tất cả Trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Vô hiệu hóa</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("");
                  setSelectedStatus("");
                  setCurrentPage(0);
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-red-600 font-medium"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Họ và Tên
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Vai trò
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Trạng thái
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm text-red-500"
                    >
                      Lỗi: {error}
                    </td>
                  </tr>
                )}
                {!loading && users.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm text-slate-500"
                    >
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  // @ts-ignore: UserRow expects UserAdminOnly but we have User. They are compatible here.
                  <UserRow
                    key={user.email}
                    user={user}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded hover:bg-gray-100 text-slate-600 disabled:opacity-50"
            >
              &lt;
            </button>
            {pageNumbers.map((pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentPage(pageIndex)}
                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  pageIndex === currentPage
                    ? "bg-red-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {pageIndex + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded hover:bg-gray-100 text-slate-600 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
