import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from "@/services/auth"
import { Link } from "react-router-dom"
import close from "@/assets/close.png"

// Định nghĩa màu sắc theo mẫu hình ảnh
const COLORS = {
  PRIMARY_BLUE: '#1B498B', // Màu chữ/icon
  PRIMARY_YELLOW: '#F0B843', // Màu nút/hành động
  BG_MINT: '#E0F7FA', // Màu nền
};

// Component icon khóa đơn giản
const LockIcon = ({ color }: { color: string }) => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthService()

  const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const { message } = await login(email, password)

      if (message) {
        alert(message)
        return
      }

      alert('Đăng nhập thành công!');
      navigate('/'); // Chuyển hướng về trang chủ

    } catch (error) {
      // Xử lý lỗi từ server
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate]); // Thêm navigate vào dependencies

  return (
    // Nền toàn màn hình với màu xanh mint
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: COLORS.BG_MINT }}
    >
      {/* Khối đăng nhập chính */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link
          to="/"
          className="h-5 w-5 block"
        >
          <img src={close} className="h-full w-full" />
        </Link>

        <div className="mb-8 flex flex-col items-center">
          <LockIcon color={COLORS.PRIMARY_BLUE} />
          <h1
            className="mt-2 text-3xl font-bold uppercase tracking-wider"
            style={{ color: COLORS.PRIMARY_BLUE }}
          >
            Đăng Nhập
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chào mừng bạn quay trở lại
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhapban@email.com"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            {/* <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            /> */}
            <div className="relative">
              <input
                id="password"
                // ⭐️ SỬ DỤNG STATE ĐỂ CHỌN LOẠI INPUT ⭐️
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                // ⭐️ Thêm padding-right (pr-10) để chừa chỗ cho icon ⭐️
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
              />

              {/* ⭐️ ICON CON MẮT ⭐️ */}
              <button
                type="button" // Rất quan trọng: Ngăn nút này submit form
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 transition"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {/* ⭐️ CHỌN ICON DỰA TRÊN STATE ⭐️ */}
                {showPassword ? (
                  // Icon mắt mở
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  // Icon mắt nhắm/gạch chéo
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0012 5.5c2.972 0 5.673 1.055 7.78 2.724m-1.745 6.81A10.476 10.476 0 0112 19.5c-2.972 0-5.673-1.055-7.78-2.724M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 21L3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-400"
            style={{ backgroundColor: COLORS.PRIMARY_YELLOW }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <Link
          to="/register"
          className="hidden text-slate-700 hover:text-red-600 sm:inline-flex"
        >
          Chưa có tài khoản? Đăng ký
        </Link>

        {/* Phần Tên Ứng Dụng (Giống footer trong ảnh) */}
        <div className="mt-8 flex items-center justify-center text-sm" style={{ color: COLORS.PRIMARY_BLUE }}>
          <span className="font-semibold">PERFUME Boutique</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;