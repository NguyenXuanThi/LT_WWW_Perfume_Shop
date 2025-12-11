// File: AdminUserManagement.tsx

import { useState, useEffect, useCallback } from "react";
import { type User, type TenVaiTro, type ChangeVaiTro } from "@/interface/User"; 
import useUserService from "@/services/user";
import UserRow from "@/components/admin/UserRow"; 
import AdminLayout from "@/components/admin/AdminLayout";
import { useStore } from "@/store"

// Constants cho filter
const ROLES = ["Customer", "Admin", ""];
const STATUSES = ["Active", "Inactive", ""];

const AdminUserManagement = () => {
    const { getTaiKhoanPage, changeActive, changeVaiTro } = useUserService();
    const { user } = useStore()

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    // Lưu ý: Nếu muốn mặc định là "Tất cả", hãy thay ROLES[0] bằng ""
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
        fetchUsers(currentPage, searchQuery, selectedRole, selectedStatus);
    }, [currentPage, searchQuery, selectedRole, selectedStatus, fetchUsers]);


    const handleToggleStatus = async (email: string, currentStatus: boolean, vaiTro: TenVaiTro) => {
        if (vaiTro === 'Admin') {
            alert("Không thể thay đổi trạng thái hoạt động của tài khoản Admin.");
            return;
        }

        const newStatus = !currentStatus;
        const action = newStatus ? 'kích hoạt' : 'vô hiệu hóa';

        if (confirm(`Bạn có chắc muốn ${action} tài khoản ${email} không?`)) {
            setLoading(true);
            try {
                const { success, message } = await changeActive(email, newStatus, vaiTro); 

                if (success) {
                    setUsers(prev => prev.map(u => u.email === email ? { ...u, active: newStatus } : u));
                    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản ${email} thành công!`);
                } else {
                    alert(`Thao tác thất bại: ${message || "Đã xảy ra lỗi không xác định."}`);
                }
            } catch (err) {
                alert('Lỗi hệ thống khi cố gắng thay đổi trạng thái.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChangeRole = useCallback(async (email: string, currentRole: TenVaiTro, newRole: TenVaiTro) => {
        if (!confirm(`Bạn có chắc muốn chuyển vai trò của tài khoản ${email} từ ${currentRole} sang ${newRole} không?`)) {
            return;
        }

        const request: ChangeVaiTro = {
            emailNeedChange: email,
            emailExecute: user?.email as string,
            vaiTro: newRole,
        };

        setLoading(true);
        try {
            const { success, message } = await changeVaiTro(request); 

            if (success) {
                setUsers(prev => prev.map(u => u.email === email ? { ...u, vaiTro: newRole } : u));
                alert(`Đã chuyển vai trò của tài khoản ${email} thành ${newRole} thành công!`);
            } else {
                alert(`Thao tác thất bại: ${message || "Đã xảy ra lỗi không xác định."}`);
            }
        } catch (err) {
            alert('Lỗi hệ thống khi cố gắng thay đổi vai trò.');
        } finally {
            setLoading(false);
        }
    }, [changeVaiTro]);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);


    return (
        <AdminLayout title="Quản lý Người Dùng"> 
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center bg-white p-6 shadow-md rounded-lg">
                    
                    {/* Search */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm kiếm Tên hoặc Email..."
                            value={searchQuery}
                            // SỬA LỖI: Thêm setCurrentPage(0) vào đây
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-red-600 focus:ring-red-600"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                            &#x1F50D; 
                        </span>
                    </div>

                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        // SỬA LỖI: Thêm setCurrentPage(0) vào đây
                        onChange={(e) => {
                            setSelectedRole(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:border-red-600 focus:ring-red-600 w-full md:w-auto"
                    >
                        <option value="">Role: All</option>
                        <option value="Admin">Role: Admin</option>
                        <option value="Customer">Role: Customer</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        // SỬA LỖI: Thêm setCurrentPage(0) vào đây
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:border-red-600 focus:ring-red-600 w-full md:w-auto"
                    >
                        <option value="">Status: All</option>
                        <option value="Active">Status: Active</option>
                        <option value="Inactive">Status: Inactive</option>
                    </select>

                    {/* Nút Reset */}
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedRole('');
                            setSelectedStatus('');
                            setCurrentPage(0);
                        }}
                        className="py-2 px-4 text-sm font-medium text-slate-600 hover:text-red-600 w-full md:w-auto"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Bảng dữ liệu */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Full Name</th>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Email</th>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Role</th>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading && (
                                <tr><td colSpan={5} className="p-4 text-center text-sm">Đang tải dữ liệu...</td></tr>
                            )}
                            {error && (
                                <tr><td colSpan={5} className="p-4 text-center text-sm text-red-500">Lỗi: {error}</td></tr>
                            )}
                            {!loading && users.length === 0 && !error && (
                                <tr><td colSpan={5} className="p-4 text-center text-sm text-slate-500">Không tìm thấy người dùng nào.</td></tr>
                            )}
                            {users.map((user) => (
                                <UserRow 
                                    key={user.email} 
                                    user={user} 
                                    onToggleStatus={handleToggleStatus} 
                                    onChangeRole={handleChangeRole}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="p-2 text-sm text-slate-600 disabled:opacity-50 hover:text-red-600"
                        >
                            &lt;
                        </button>
                        {pageNumbers.map((pageIndex) => (
                            <button
                                key={pageIndex}
                                onClick={() => setCurrentPage(pageIndex)}
                                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                                    pageIndex === currentPage 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {pageIndex + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 text-sm text-slate-600 disabled:opacity-50 hover:text-red-600"
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