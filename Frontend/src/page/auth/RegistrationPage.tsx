import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthService from "@/services/auth"
import type { NewUser, UserError } from '@/interface/User';

// Định nghĩa màu sắc theo mẫu hình ảnh
const COLORS = {
  PRIMARY_BLUE: '#1B498B', // Màu chữ/icon
  PRIMARY_YELLOW: '#F0B843', // Màu nút/hành động
  BG_MINT: '#E0F7FA', // Màu nền
};

// Component icon user đơn giản
const UserIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ====================================================
// ⭐️ LOGIC VALIDATION (Được đặt ở ngoài component để tránh re-render)
// ====================================================

// Regex cho Họ Tên (Viết hoa chữ cái đầu của mỗi từ)
const HO_TEN_REGEX = /^[A-ZÀÁẠẢÃĂẮẰẶẲẪÂẤẦẬẨẪĐÉÈẸẺẼÊẾỀỆỂỄÍÌỊỈĨÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠÚÙỤỦŨƯỨỪỰỬỮÝỲỴỶỸ][a-zàáạảãăắằặẳẵâấầậậẩẫđéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữýỳỵỷỹ]+(?: [A-ZÀÁẠẢÃĂẮẰẶẲẪÂẤẦẬẨẪĐÉÈẸẺẼÊẾỀỆỂỄÍÌỊỈĨÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠÚÙỤỦŨƯỨỪỰỬỮÝỲỴỶỸ][a-zàáạảãăắằặẳẵâấầậẩẫđéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữýỳỵỷỹ]+)*$/;

// Regex cho Số Điện Thoại (Chỉ 10 chữ số)
const SO_DIEN_THOAI_REGEX = /^\d{10}$/;

// Regex cho Mật khẩu (Tối thiểu 8 ký tự, có 1 hoa, 1 thường, 1 số)
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// Hàm kiểm tra
const isValidHoTen = (hoTen: string): boolean => HO_TEN_REGEX.test(hoTen.trim());
const isValidSoDienThoai = (soDienThoai: string): boolean => SO_DIEN_THOAI_REGEX.test(soDienThoai);
const isValidPassword = (password: string): boolean => PASSWORD_REGEX.test(password);

// ====================================================
// COMPONENT REGISTRATION PAGE
// ====================================================

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    ngaySinh: '',
    soDienThoai: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    diaChi: '',
  });
  const [loading, setLoading] = useState(false);
  // ⭐️ Trạng thái để lưu lỗi từ Server, có thể Partial vì không phải trường nào cũng lỗi
  const [fieldErrors, setFieldErrors] = useState<Partial<UserError>>({}); 

  // ⭐️ State cho toggle password (riêng cho từng field để đơn giản)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  // ⭐️ Sử dụng hook service của bạn
  const { register } = useAuthService(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa lỗi cũ khi người dùng bắt đầu nhập lại
    setFieldErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  // ⭐️ Handlers cho toggle password
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({}); // Xóa tất cả lỗi cũ khi bắt đầu submit

    setLoading(true);
    try {
        // Gọi API với dữ liệu form
        const { success, message, errors } = await register(formData);
        
        if (success) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login'); 
        } else if (errors) {
            // ⭐️ Cập nhật trạng thái lỗi để hiển thị dưới input
            setFieldErrors(errors);
            
            // Hiển thị thông báo chung nếu có (ví dụ: "Thông tin đăng ký không hợp lệ.")
            if (message) alert(message); 
            
        } else if (message) {
            // Lỗi chung (không phải lỗi validation, ví dụ: Lỗi server 500)
            alert(`Đăng ký thất bại: ${message}`);
        }
        
    } catch (error) {
        alert('Đã xảy ra lỗi hệ thống hoặc mạng. Vui lòng thử lại.');
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [formData, navigate, register]);
  
  // Hàm render input chuẩn (sửa nhẹ để hỗ trợ password toggle)
  const renderInput = (
    name: keyof typeof formData, 
    label: string, 
    type: string, 
    placeholder?: string,
    showPassword?: boolean,  // Optional, chỉ dùng cho password
    onToggle?: () => void    // Optional, chỉ dùng cho password
  ) => {
    const hasError = !!fieldErrors[name];
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputClass = `w-full rounded-xl border px-4 py-3 text-sm transition focus:ring-1 ${
      hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
    } ${isPassword ? 'pr-10' : ''}`;  // Thêm padding cho icon nếu password
    
    return (
      <div>
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">  {/* Wrapper cho icon nếu password */}
          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              rows={3}
              required
              className={`${inputClass} resize-none`}
            />
          ) : (
            <input
              id={name}
              name={name}
              type={inputType}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className={inputClass}
            />
          )}
          {/* ⭐️ Icon toggle nếu là password */}
          {isPassword && showPassword !== undefined && onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 transition"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                // Icon mắt mở
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // Icon mắt nhắm
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0012 5.5c2.972 0 5.673 1.055 7.78 2.724m-1.745 6.81A10.476 10.476 0 0112 19.5c-2.972 0-5.673-1.055-7.78-2.724M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 21L3 3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {/* ⭐️ HIỂN THỊ THÔNG BÁO LỖI */}
        {hasError && (
          <p className="mt-1 text-xs font-medium text-red-500">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };
  
  return (
    <div 
        className="flex min-h-screen items-center justify-center p-4 py-10" 
        style={{ backgroundColor: COLORS.BG_MINT }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center">
          <UserIcon color={COLORS.PRIMARY_BLUE} />
          <h1 
            className="mt-2 text-3xl font-bold uppercase tracking-wider" 
            style={{ color: COLORS.PRIMARY_BLUE }}
          >
            Đăng Ký Tài Khoản
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hãy gia nhập cộng đồng của chúng tôi!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Hàng 1: Họ Tên & Ngày Sinh */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderInput('hoTen', 'Họ Tên', 'text', 'Nguyễn Văn A')}
            {renderInput('ngaySinh', 'Ngày Sinh', 'date')}
          </div>

          {/* Hàng 2: Email & Số Điện Thoại */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderInput('email', 'Email', 'email', 'email@example.com')}
            {renderInput('soDienThoai', 'Số Điện Thoại', 'tel', '09xx xxx xxx')}
          </div>

          {/* Hàng 3: Mật khẩu */}
          {renderInput('newPassword', 'Mật khẩu', 'password', '••••••••', showNewPassword, toggleNewPassword)}

          {/* Hàng 4: Xác nhận mật khẩu */}
          {renderInput('confirmPassword', 'Xác nhận mật khẩu', 'password', '••••••••', showConfirmPassword, toggleConfirmPassword)}

          {/* Hàng 5: Địa Chỉ */}
          {renderInput('diaChi', 'Địa Chỉ', 'textarea', 'Số nhà, đường, phường/xã, quận/huyện...')}

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-400"
            style={{ backgroundColor: COLORS.PRIMARY_YELLOW }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
          </button>
        </form>
        
        {/* Liên kết về trang Đăng nhập */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold" style={{ color: COLORS.PRIMARY_BLUE }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;