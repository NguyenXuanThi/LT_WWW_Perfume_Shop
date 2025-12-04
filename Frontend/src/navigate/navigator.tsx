import { Routes, Route } from "react-router-dom";
import HomePage from "../page/home/HomePage";
import ProductListPage from "../page/product/ProductListPage";
import ProductDetailPage from "../page/product/ProductDetailPage";
import AccountPage from "../page/account/AccountPage";

const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nuoc-hoa-nam" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
};

export default Navigator;
