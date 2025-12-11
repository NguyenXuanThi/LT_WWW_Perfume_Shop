import React, { useCallback, useState } from 'react';
import { type UpdateUser, type UserError } from "@/interface/User"
import { useStore } from "@/store"
import useUserService from "@/services/user"
import { useNavigate } from "react-router-dom"

type FieldErrorState = Partial<UserError & {
    currentPassword?: string,
    newPassword?: string,
    confirmNewPassword?: string
}>;

interface InputFieldProps {
    label: string;
    name: keyof UpdateUser;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    readOnly?: boolean;
    isRequired?: boolean;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   name,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   type = 'text',
                                                   readOnly = false,
                                                   isRequired = false,
                                                   error,
                                               }) => {
    const hasError = !!error;
    const isTextArea = name === 'diaChi' && type === 'textarea';

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                {label} {isRequired && <span className="text-red-600">*</span>}
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
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 focus:outline-none resize-none transition-colors
                        ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}
                        ${hasError ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-50'}
                    `}
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
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-colors
                        ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}
                        ${hasError ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-50'}
                    `}
                />
            )}

            {hasError && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    );
};

const AccountDetailsForm = () => {
    const { user } = useStore()
    const { update } = useUserService()
    const navigate = useNavigate()

    const [formData, setFormData] = useState<UpdateUser>({
        hoTen: user?.hoTen as string,
        ngaySinh: (user?.ngaySinh as string)?.split('T')[0] || '',
        soDienThoai: user?.soDienThoai as string,
        email: user?.email as string,
        diaChi: user?.diaChi as string,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrorState>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setFieldErrors(prev => ({ ...prev, [e.target.name as keyof FieldErrorState]: undefined }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

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
            const { success, message, errors } = await update(formData);

            if (success) {
                alert('Cập nhật tài khoản thành công! Vui lòng đăng nhập lại.');
                navigate('/login');
            } else if (errors) {
                setFieldErrors(errors as FieldErrorState);
                if (message) alert(message);
            } else if (message) {
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
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold text-slate-900 border-b border-slate-200 pb-4">
                Thông tin tài khoản
            </h2>

            {/* Thông tin cơ bản */}
            <div className="mb-6">
                <h3 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Thông tin cá nhân
                </h3>

                <InputField
                    label="Họ và Tên"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleChange}
                    isRequired={true}
                    error={fieldErrors.hoTen}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField
                        label="Ngày Sinh"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleChange}
                        type="date"
                        isRequired={true}
                        error={fieldErrors.ngaySinh}
                    />
                    <InputField
                        label="Số Điện Thoại"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleChange}
                        type="tel"
                        isRequired={true}
                        error={fieldErrors.soDienThoai}
                    />
                </div>

                <InputField
                    label="Địa chỉ Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    readOnly={true}
                    error={fieldErrors.email}
                />
                <p className="text-xs text-slate-500 -mt-2">
                    Email không thể thay đổi
                </p>

                <InputField
                    label="Địa Chỉ"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleChange}
                    type="textarea"
                    error={fieldErrors.diaChi}
                />
            </div>

            {/* Thay đổi mật khẩu */}
            <div className="border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Thay đổi mật khẩu
                </h3>

                <p className="mb-4 text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    💡 Chỉ điền các trường dưới đây nếu bạn muốn thay đổi mật khẩu
                </p>

                <InputField
                    label="Mật khẩu Hiện tại"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    error={fieldErrors.currentPassword}
                />
                <InputField
                    label="Mật khẩu Mới"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    error={fieldErrors.newPassword || fieldErrors.password}
                />
                <InputField
                    label="Xác nhận Mật khẩu Mới"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    error={fieldErrors.confirmNewPassword}
                />
            </div>

            {/* Nút Save Changes */}
            <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-full border border-slate-300 px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default AccountDetailsForm;