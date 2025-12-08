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

const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nuoc-hoa-nam" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route element={<AdminAuthenticate/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
      <Route element={<AccountAuthenticate/>}>
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
};

export default Navigator;
