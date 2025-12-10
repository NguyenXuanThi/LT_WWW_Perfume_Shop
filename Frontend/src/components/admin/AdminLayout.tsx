import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, removeToken, removeUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      removeToken();
      removeUser();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-slate-900">
                  {title}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.hoTen}
                  </p>
                  <p className="text-xs text-slate-500">{user?.vaiTro}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                  {user?.hoTen?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
