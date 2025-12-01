// src/navigate/navigator.tsx

import { Routes, Route } from "react-router-dom";
import HomePage from "../page/home/HomePage";
import ProductListPage from "../page/product/ProductListPage";

const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* collection nước hoa nam */}
      <Route path="/nuoc-hoa-nam" element={<ProductListPage />} />
      {/* sau này thêm: /nuoc-hoa-nu, /nuoc-hoa-unisex, ... */}
    </Routes>
  );
};

export default Navigator;
