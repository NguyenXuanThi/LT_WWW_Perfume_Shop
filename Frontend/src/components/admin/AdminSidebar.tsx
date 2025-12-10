import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  children?: { name: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { name: "Quản lý sản phẩm", path: "/admin/products", icon: "📦" },
  { name: "Quản lý loại SP", path: "/admin/categories", icon: "🏷️" },
  { name: "Quản lý đơn hàng", path: "/admin/orders", icon: "🛒" },
  { name: "Quản lý người dùng", path: "/admin/manage", icon: "👥" },
  {
    name: "Thống kê",
    path: "/admin/statistics",
    icon: "📈",
    children: [
      { name: "Doanh thu", path: "/admin/statistics/revenue" },
      { name: "Top sản phẩm", path: "/admin/statistics/top-products" },
      { name: "Đơn hàng", path: "/admin/statistics/orders" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Tự động mở menu con nếu đang ở trang thống kê
  useEffect(() => {
    if (location.pathname.startsWith("/admin/statistics")) {
      setIsStatsOpen(true);
    }
  }, [location.pathname]);

  const toggleStats = () => setIsStatsOpen(!isStatsOpen);

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto z-50 shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold shadow-lg shadow-red-900/50">
            PF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              PERFUME
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              ADMINISTRATOR
            </span>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;

            // Logic Active chính xác
            const isExactActive = location.pathname === item.path;
            const isParentActive =
              hasChildren && location.pathname.startsWith(item.path);
            const isActive = isExactActive || isParentActive;

            // Style cho menu item
            const baseClass =
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm";
            const activeClass =
              "bg-red-600 text-white shadow-md shadow-red-900/20";
            const inactiveClass =
              "text-slate-400 hover:bg-slate-800 hover:text-white";

            // Riêng cho menu cha Thống kê (khi active thì nền khác hoặc giữ nguyên style)
            const parentActiveClass = "bg-slate-800 text-white";

            if (hasChildren) {
              return (
                <li key={item.path}>
                  <button
                    onClick={toggleStats}
                    className={`${baseClass} justify-between ${
                      isActive ? parentActiveClass : inactiveClass
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`text-[10px] transition-transform duration-300 ${
                        isStatsOpen ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {/* Submenu Animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isStatsOpen
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="ml-4 border-l border-slate-700 pl-2 space-y-1">
                      {item.children?.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                                isChildActive
                                  ? "text-red-400 font-semibold bg-slate-800/50"
                                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${baseClass} ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700 bg-slate-900 sticky bottom-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 border border-transparent hover:border-slate-600"
        >
          <span className="text-xl">🏠</span>
          <span className="text-sm font-medium">Về Trang Chủ</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
