import { Routes, Route } from "react-router-dom";
import HomePage from "../page/home/HomePage";
import ProductListPage from "../page/product/ProductListPage";
import ProductDetailPage from "../page/product/ProductDetailPage";
import AccountPage from "../page/account/AccountPage";
import LoginPage from "@/page/auth/LoginPage";
import RegistrationPage from "@/page/auth/RegistrationPage";
import AdminAuthenticate from "@/page/admin/AdminAuthenticate";
import AdminDashboard from "@/page/admin/AdminDashboard";
import AccountAuthenticate from "@/page/account/AccountAuthenticate";
import AdminUserManagement from "@/page/admin/AdminUserManagement";
import CartPage from "@/page/CartPage/CartPage.tsx";
import CheckoutPage from "@/page/CartPage/CheckoutPage.tsx";
import OrderSuccessPage from "@/page/CartPage/OrderSuccessPage.tsx";
import AdminProductList from "@/page/admin/AdminProductList";
import AdminCategoryList from "@/page/admin/AdminCategoryList";
import AdminOrderList from "@/page/admin/AdminOrderList";
import AdminStatistics from "@/page/admin/AdminStatistics";
import AdminProductEdit from "@/page/admin/AdminProductEdit";
const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Dynamic gender routes for perfume listing */}
      <Route path="/nuoc-hoa/:gender" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route element={<AdminAuthenticate/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage" element={<AdminUserManagement />} />
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/categories" element={<AdminCategoryList />} />
        <Route path="/admin/orders" element={<AdminOrderList />} />
        <Route path="/admin/statistics/:type" element={<AdminStatistics />} />
        <Route path="/admin/products/:id" element={<AdminProductEdit />} />
        <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />
      </Route>
      <Route element={<AccountAuthenticate/>}>
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
};

export default Navigator;
