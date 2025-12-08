import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from "@/services/auth"
import { Link } from "react-router-dom"

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
  const navigate = useNavigate();
  const { login } = useAuthService()

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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
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