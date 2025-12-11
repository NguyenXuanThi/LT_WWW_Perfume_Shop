// File: UserRow.tsx

import React from 'react';
import { type User, type TenVaiTro } from '@/interface/User';

interface UserRowProps {
    user: User;
    // Thêm vaiTro vào tham số onToggleStatus
    onToggleStatus: (email: string, currentStatus: boolean, vaiTro: User['vaiTro']) => void; 
    onChangeRole: (email: string, currentRole: TenVaiTro, newRole: TenVaiTro) => void; 
}

const UserRow: React.FC<UserRowProps> = ({ user, onToggleStatus, onChangeRole }) => {
    const isInactive = !user.active;
    
    // SỬA: KHÔI PHỤC KIỂM TRA ADMIN cho Status
    const isStatusDisabled = user.vaiTro === 'Admin'; 
    // GIỮ NGUYÊN: Role luôn được phép thay đổi
    const isRoleChangeDisabled = user.email === "admin@shop.com"; 

    // Màu sắc cho trạng thái
    const statusClass = isInactive 
        ? 'bg-gray-300 text-gray-800' 
        : 'bg-green-100 text-green-700';
    
    // Nút hành động Status
    const actionButtonText = isInactive ? 'ACTIVATE' : 'DEACTIVATE';
    // Class button
    const actionButtonClass = isStatusDisabled
        ? 'text-slate-400 cursor-not-allowed' 
        : isInactive 
        ? 'text-green-600 hover:text-green-800' 
        : 'text-red-600 hover:text-red-800';

    const handleToggle = () => {
        // Truyền vaiTro vào hàm xử lý
        onToggleStatus(user.email, user.active, user.vaiTro); 
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as TenVaiTro;
        if (newRole !== user.vaiTro) {
            onChangeRole(user.email, user.vaiTro, newRole);
        }
    };

    return (
        <tr className="border-b hover:bg-slate-50">
            {/* Tên */}
            <td className="p-3 text-sm font-medium text-slate-900">{user.hoTen}</td>
            
            {/* Email */}
            <td className="p-3 text-xs text-slate-600">
                <a href={`mailto:${user.email}`} className="hover:underline">
                    {user.email}
                </a>
            </td>

            {/* Role (CÓ THỂ CHỈNH SỬA) */}
            <td className="p-3 text-xs text-slate-600">
                <select
                    value={user.vaiTro}
                    onChange={handleRoleChange}
                    disabled={isRoleChangeDisabled} 
                    className={`border rounded-md px-2 py-1 text-xs font-medium focus:border-red-500 focus:ring-red-500 w-24 ${
                        isRoleChangeDisabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700'
                    }`}
                >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                </select>
            </td>
            
            {/* Status (Trạng thái) */}
            <td className="p-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusClass}`}>
                    {user.active ? 'Active' : 'Inactive'}
                </span>
            </td>

            {/* Hành động (Actions) */}
            <td className="p-3 text-right">
                <button
                    onClick={handleToggle}
                    disabled={isStatusDisabled} // KHÔI PHỤC CHECK ADMIN
                    className={`text-xs font-semibold ${actionButtonClass} transition duration-150`}
                >
                    {actionButtonText}
                </button>
            </td>
        </tr>
    );
};

export default UserRow;