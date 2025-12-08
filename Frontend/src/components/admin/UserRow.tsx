// File: UserRow.tsx
import React from 'react';
import { type UserAdminOnly } from '@/interface/User';

interface UserRowProps {
    user: UserAdminOnly;
    // Thêm vaiTro vào tham số onToggleStatus
    onToggleStatus: (email: string, currentStatus: boolean, vaiTro: UserAdminOnly['vaiTro']) => void; 
}

const UserRow: React.FC<UserRowProps> = ({ user, onToggleStatus }) => {
    const isInactive = !user.active;
    // ⭐️ KIỂM TRA: Vô hiệu hóa nút nếu là Admin
    const isDisabled = user.vaiTro === 'Admin'; 

    // Màu sắc cho trạng thái
    const statusClass = isInactive 
        ? 'bg-gray-300 text-gray-800' 
        : 'bg-green-100 text-green-700';
    
    // Nút hành động
    const actionButtonText = isInactive ? 'ACTIVATE' : 'DEACTIVATE';
    const actionButtonClass = isDisabled
        ? 'text-slate-400 cursor-not-allowed' // Màu xám và không cho click
        : isInactive 
        ? 'text-green-600 hover:text-green-800' 
        : 'text-red-600 hover:text-red-800';

    const handleToggle = () => {
        // Truyền vaiTro vào hàm xử lý
        onToggleStatus(user.email, user.active, user.vaiTro); 
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

            {/* Role */}
            <td className="p-3 text-xs text-slate-600">{user.vaiTro}</td>
            
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
                    disabled={isDisabled} // ⭐️ Vô hiệu hóa nút
                    className={`text-xs font-semibold ${actionButtonClass} transition duration-150`}
                >
                    {actionButtonText}
                </button>
            </td>
        </tr>
    );
};

export default UserRow;