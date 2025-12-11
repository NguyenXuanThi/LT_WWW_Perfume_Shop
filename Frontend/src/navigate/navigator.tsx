import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../page/home/HomePage";
import ProductListPage from "../page/product/ProductListPage2";
import ProductDetailPage from "../page/product/ProductDetailPage";
import AccountPage from "../page/account/AccountPage";
import LoginPage from "@/page/auth/LoginPage";
import RegistrationPage from "@/page/auth/RegistrationPage";
import AdminAuthenticate from "@/page/admin/AdminAuthenticate";
import AdminDashboard from "@/page/admin/AdminDashboard";
import AdminProductList from "@/page/admin/AdminProductList";
import AdminProductEdit from "@/page/admin/AdminProductEdit";
import AdminOrderList from "@/page/admin/AdminOrderList";
import AdminUserManagement from "@/page/admin/AdminUserManagement";
import AccountAuthenticate from "@/page/account/AccountAuthenticate";
import AdminStatistics from "@/page/admin/AdminStatistics";
import AdminCategoryList from "@/page/admin/AdminCategoryList";
import CartPage from "@/page/CartPage/CartPage";
import CheckoutPage from "@/page/CartPage/CheckoutPage";
import OrderSuccessPage from "@/page/CartPage/OrderSuccessPage.tsx";
const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nuochoa/:gender" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Admin Routes */}
      <Route element={<AdminAuthenticate />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategoryList />} />
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/products/new" element={<AdminProductEdit />} />
        <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />

        <Route path="/admin/orders" element={<AdminOrderList />} />
        <Route path="/admin/manage" element={<AdminUserManagement />} />

        {/* Routes Thống kê mới */}
        <Route
          path="/admin/statistics"
          element={<Navigate to="/admin/statistics/revenue" replace />}
        />
        <Route path="/admin/statistics/:type" element={<AdminStatistics />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<AccountAuthenticate />}>
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
};

export default Navigator;
