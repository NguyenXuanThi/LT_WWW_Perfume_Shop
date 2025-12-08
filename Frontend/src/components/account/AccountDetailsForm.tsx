import React, { useCallback, useState } from 'react';
// ⭐️ IMPORT THÊM UserError để quản lý lỗi validation từ server
import { type UpdateUser, type UserError } from "@/interface/User"
import { useStore } from "@/store"
import useUserService from "@/services/user"
import { useNavigate } from "react-router-dom"

// Type cho state lỗi, bao gồm các lỗi của UserError và các trường mật khẩu
type FieldErrorState = Partial<UserError & { 
    currentPassword?: string, 
    newPassword?: string, 
    confirmNewPassword?: string 
}>;

// ====================================================
// ⭐️ ĐỊNH NGHĨA TYPE CHO INPUTFIELD PROPS (ĐÃ THÊM ERROR)
// ====================================================

interface InputFieldProps {
    label: string;
    // ⭐️ Sử dụng keyof UpdateUser & 'confirmNewPassword' làm tên trường hợp lệ
    name: keyof UpdateUser;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string; 
    readOnly?: boolean;
    isRequired?: boolean;
    error?: string; // ⭐️ Prop lỗi mới
}


// Component Input Field có thể tái sử dụng
const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    readOnly = false,
    isRequired = false,
    error, // ⭐️ Nhận prop error
}) => {

    const hasError = !!error; // Kiểm tra xem có lỗi không
    const isTextArea = name === 'diaChi' && type === 'textarea';

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>

            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                    rows={3}
                    required={isRequired}
                    readOnly={readOnly}
                    className={`w-full border-b py-2 text-sm text-slate-900 focus:outline-none resize-none bg-white 
                        ${hasError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-black'}
                    `} // ⭐️ Thêm style lỗi
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    required={isRequired}
                    className={`w-full border-b py-2 text-sm text-slate-900 focus:outline-none bg-white 
                        ${hasError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-black'}
                    `} // ⭐️ Thêm style lỗi
                />
            )}
            
            {/* ⭐️ Hiển thị thông báo lỗi */}
            {hasError && (
                <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
            )}
        </div>
    );
};
// ====================================================

const AccountDetailsForm = () => {
    const { user } = useStore()
    const { update } = useUserService()
    const navigate = useNavigate()
    
    // ⭐️ Sử dụng UpdateUser trực tiếp cho state
    const [formData, setFormData] = useState<UpdateUser>({
        hoTen: user?.hoTen as string,
        // Chuyển Date sang string yyyy-mm-dd cho input type="date"
        ngaySinh: (user?.ngaySinh as string)?.split('T')[0] || '', 
        soDienThoai: user?.soDienThoai as string,
        email: user?.email as string,
        diaChi: user?.diaChi as string,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    // ⭐️ State để lưu lỗi validation trả về từ server và lỗi local
    const [fieldErrors, setFieldErrors] = useState<FieldErrorState>({});

    // Xử lý chung cho cả input và textarea
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // ⭐️ Xóa lỗi của trường hiện tại khi người dùng bắt đầu nhập
        // Dùng as keyof FieldErrorState để đảm bảo TypeScript nhận dạng được tên trường
        setFieldErrors(prev => ({ ...prev, [e.target.name as keyof FieldErrorState]: undefined }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({}); // Reset lỗi khi submit

        // Xử lý lỗi mật khẩu không khớp local
        if (formData.newPassword && (formData.newPassword !== formData.confirmPassword)) {
            setFieldErrors(prev => ({ 
                ...prev, 
                confirmNewPassword: "Mật khẩu mới và xác nhận mật khẩu không khớp." 
            }));
            setLoading(false);
            return;
        }

        if (!confirm("Bạn có chắc muốn thay đổi không? Nếu thay đổi sẽ tự động đăng xuất")) {
            setLoading(false);
            return
        }

        try {
            // ⭐️ Gọi API với formData (đã là UpdateUser)
            const { success, message, errors } = await update(formData);

            if (success) {
                alert('Cập nhật tài khoản thành công! Vui lòng đăng nhập lại.');
                navigate('/login');
            } else if (errors) {
                // ⭐️ Cập nhật trạng thái lỗi từ server để hiển thị dưới input
                // errors là UserError, cần ép kiểu để gán vào FieldErrorState
                setFieldErrors(errors as FieldErrorState); 

                // Hiển thị thông báo chung nếu có
                if (message) alert(message);

            } else if (message) {
                // Lỗi chung (ví dụ: Lỗi server 500)
                alert(`Cập nhật thất bại: ${message}`);
            }

        } catch (error) {
            alert('Đã xảy ra lỗi hệ thống hoặc mạng. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [formData, navigate, update]);


    return (
        <form onSubmit={handleSubmit} className="p-2">
            <h2 className="mb-6 text-base font-semibold text-slate-900">ACCOUNT DETAILS</h2>

            {/* Họ Tên */}
            <InputField
                label="Họ và Tên"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                isRequired={true}
                error={fieldErrors.hoTen} // ⭐️ Truyền lỗi
            />

            {/* Ngày Sinh & Số Điện Thoại */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                    label="Ngày Sinh"
                    name="ngaySinh"
                    value={formData.ngaySinh}
                    onChange={handleChange}
                    type="date"
                    isRequired={true}
                    error={fieldErrors.ngaySinh} // ⭐️ Truyền lỗi
                />
                <InputField
                    label="Số Điện Thoại"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    type="tel"
                    isRequired={true}
                    error={fieldErrors.soDienThoai} // ⭐️ Truyền lỗi
                />
            </div>

            {/* Email (Thường là ReadOnly) */}
            <InputField
                label="Địa chỉ Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                readOnly={true}
                error={fieldErrors.email} // ⭐️ Truyền lỗi
            />
            <p className="mb-6 text-xs text-slate-500">
                Email thường không thể thay đổi trực tiếp.
            </p>

            {/* Địa Chỉ */}
            <InputField
                label="Địa Chỉ"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                type="textarea"
                error={fieldErrors.diaChi} // ⭐️ Truyền lỗi
            />


            {/* Thay đổi Mật khẩu */}
            <h3 className="mb-4 mt-8 text-sm font-semibold text-slate-900">Password change</h3>

            <p className="mb-4 text-xs text-slate-500">
                (Điền mật khẩu hiện tại và mật khẩu mới nếu bạn muốn thay đổi)
            </p>

            <InputField
                label="Mật khẩu Hiện tại"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                type="password"
                // Lỗi currentPassword có thể đến từ server hoặc do lỗi logic khác
                error={fieldErrors.currentPassword} 
            />
            <InputField
                label="Mật khẩu Mới"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                // Lỗi newPassword có thể đến từ server (dùng trường password của UserError)
                error={fieldErrors.newPassword || fieldErrors.password} 
            />
            <InputField
                label="Xác nhận Mật khẩu Mới"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                // Lỗi confirmNewPassword chỉ đến từ local validation (mật khẩu không khớp)
                error={fieldErrors.confirmNewPassword} 
            />

            {/* Nút Save Changes */}
            <button
                type="submit"
                disabled={loading}
                className="mt-6 w-fit rounded bg-black px-6 py-2 text-sm font-semibold uppercase text-white shadow hover:bg-slate-800 disabled:opacity-50"
            >
                {loading ? 'SAVING...' : 'Save changes'}
            </button>
        </form>
    );
};

export default AccountDetailsForm;