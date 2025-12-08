1. Thư mục gốc dự án (root)

Các file quan trọng (nằm ngoài thư mục src/):

index.html: file HTML gốc cho ứng dụng Vite/React.

package.json: khai báo dependency, scripts (npm run dev, npm run build...).

vite.config.ts: cấu hình Vite (proxy đến Spring Boot, alias, plugin…).

tsconfig.json: cấu hình TypeScript.

(Tuỳ chọn) tailwind.config.ts, postcss.config.js, eslint.config.js: nếu bạn dùng TailwindCSS, PostCSS, ESLint.

👉 Bạn không code logic React ở đây, chủ yếu là cấu hình.

2. src/main.tsx

Mục đích: Điểm vào (entry point) của ứng dụng React.

Công việc chính:

Gắn React vào DOM (document.getElementById('root')).

Bọc App với các provider cần thiết (VD: BrowserRouter, QueryClientProvider, AuthProvider…).

Ví dụ (ý tưởng):

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<BrowserRouter>
<App />
</BrowserRouter>
</React.StrictMode>,
)

3. src/App.tsx

Mục đích: Component “root” của app.

Thường:

Gọi navigator.tsx (chứa định nghĩa route).

Bọc chung trong layout (Header/Footer), hoặc layout làm riêng.

Ví dụ hướng tổ chức:

import Navigator from './navigate/navigator'

function App() {
return <Navigator />
}

export default App

4. src/navigate/
   navigator.tsx

Mục đích: Định nghĩa routing cho toàn bộ app (sử dụng react-router-dom).

Chứa mapping:

/ → HomePage

/product → ProductListPage

/product/:id → ProductDetailPage

/checkout → CheckoutPage

/account → AccountPage

/admin → AdminDashboard / AdminProductList / AdminProductEdit

Bạn sẽ import các page ở đây và dùng <Routes><Route /></Routes>.

5. src/page/ – các trang (page level)

Đây là nơi để các màn hình chính tương ứng với URL.

page/home/HomePage.tsx

Trang chủ shop nước hoa.

Hiển thị:

Banner / hero.

Danh sách sản phẩm nổi bật (sử dụng ProductCard).

Có thể load dữ liệu qua services/product.ts.

page/product/

ProductListPage.tsx:

Trang danh sách nước hoa (tất cả sản phẩm / theo filter).

ProductDetailPage.tsx:

Trang chi tiết 1 sản phẩm: /product/:id

Hiển thị tên, ảnh, mô tả, giá, tình trạng kho, nút “Thêm vào giỏ”.

page/checkout/CheckoutPage.tsx

Trang thanh toán:

Xem lại giỏ hàng.

Form nhập địa chỉ, phương thức thanh toán.

Gọi API từ services/order.ts để tạo đơn hàng.

page/account/AccountPage.tsx

Trang “My Account”:

Thông tin user (tên, email…).

Lịch sử đơn hàng.

Có thể dùng API từ services/auth.ts và services/order.ts.

page/admin/

AdminDashboard.tsx:

Trang tổng quan admin (tổng sản phẩm, đơn hàng, doanh thu…).

AdminProductList.tsx:

Trang quản lý tồn kho:

Danh sách sản phẩm.

Nút sửa, xoá, thêm mới.

AdminProductEdit.tsx:

Form thêm/sửa sản phẩm (tên, giá, số lượng tồn, imageUrl…).

👉 Quy tắc:
Mỗi route chính → 1 file trong page/.
Logic xử lý chi tiết thì tách xuống components/ và services/.

6. src/components/ – các component tái sử dụng
   components/layout/

Header.tsx:

Logo shop nước hoa.

Menu: Home, Shop, My Account, Cart.

Footer.tsx:

Thông tin liên hệ, social, copyright.

Sidebar.tsx:

Dùng cho trang admin (menu trái: Products, Orders, Users…).

components/product/

ProductCard.tsx:

Hiển thị 1 sản phẩm dạng card: hình, tên, giá, nút xem chi tiết / thêm vào giỏ.

Dùng trong HomePage, ProductListPage.

ProductPrice.tsx:

Component nhỏ chỉ hiển thị giá.

Dùng để format tiền tệ (vd: VNĐ, USD).

components/cart/

CartIcon.tsx:

Icon giỏ hàng trên Header, có badge số lượng.

CartSummary.tsx:

Tổng quan giỏ: danh sách item + tổng tiền.

Dùng trong CheckoutPage hoặc mini-cart.

👉 Quy tắc:
Thứ gì được dùng lại nhiều lần → cho vào components/, đừng để logic UI lẫn lộn trong page/.

7. src/services/ – gọi API (kết nối Spring Boot bằng axios)

Đây là nơi duy nhất frontend nói chuyện với backend Spring Boot.
React component không import axios trực tiếp, mà chỉ gọi các hàm trong services.

Cấu trúc gợi ý:

src/services/
http.ts // cấu hình axios chung (baseURL, token, interceptor)
product.ts // API liên quan tới sản phẩm / nước hoa
order.ts // API liên quan tới đơn hàng / checkout
auth.ts // API đăng nhập, logout, lấy thông tin user
user.ts // (tuỳ) API quản lý user/profile/địa chỉ

7.1. services/http.ts – axios client dùng chung

Mục đích:

Tạo axios instance với:

baseURL trỏ tới backend (VD: http://localhost:8080/api hoặc VITE_API_BASE_URL).

withCredentials nếu backend dùng cookie/session.

Headers mặc định (Content-Type: application/json).

Gắn interceptor:

Request: gắn Authorization: Bearer <token> nếu có token trong localStorage.

Response: xử lý chung lỗi 401 (chưa login), 403, 500… (log, redirect, show toast).

Export helper: httpGet, httpPost, httpPut, httpDelete – đã có generic type <T>.

Ví dụ ý tưởng:

import axios from "axios";

const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const http = axios.create({
baseURL: API_BASE_URL,
withCredentials: true,
headers: {
"Content-Type": "application/json",
},
});

http.interceptors.request.use((config) => {
const token = localStorage.getItem("access_token");
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export async function httpGet<T>(url: string, params?: unknown): Promise<T> {
const res = await http.get<T>(url, { params });
return res.data;
}

export async function httpPost<T>(url: string, data?: unknown): Promise<T> {
const res = await http.post<T>(url, data);
return res.data;
}

// tương tự cho httpPut, httpDelete

👉 Sau này nếu cần thay baseURL, refresh token, đổi cách handle lỗi… chỉ sửa trong http.ts.

7.2. services/product.ts – API liên quan tới nước hoa

Làm việc với các entity trong DB:

NuocHoa + LoaiNuocHoa + ChiTietNuocHoa + DanhGia + HinhAnhNuocHoa…

Các hàm chính:

List sản phẩm (cho trang collection/category):

import { httpGet } from "./http";
import type { Gender, PerfumeDetail } from "../interface/Product";

export type PerfumeListQuery = {
gender?: Gender; // MALE/FEMALE/UNISEX
brands?: string[]; // ["Dior","Versace"]
minPrice?: number;
maxPrice?: number;
sort?: "BEST_SELLING" | "PRICE_ASC" | "PRICE_DESC" | "NEWEST";
page?: number;
size?: number;
};

export async function getPerfumes(
query: PerfumeListQuery
): Promise<PerfumeDetail[]> {
return httpGet<PerfumeDetail[]>("/perfumes", query);
}

Chi tiết sản phẩm (trang single product):

export async function getPerfumeDetail(id: number): Promise<PerfumeDetail> {
return httpGet<PerfumeDetail>(`/perfumes/${id}`);
}

CRUD cho admin (tạo/sửa/xoá nước hoa) khi cần.

Component sử dụng:

ProductListPage:

gọi getPerfumes({ gender: "MALE", ...filter }).

ProductDetailPage:

gọi getPerfumeDetail(Number(idFromRoute)).

7.3. services/order.ts – API cho đơn hàng / checkout

Mapping với các bảng:

DonHang, ChiTietDonHang, PhuongThucThanhToan, (và có thể TrangThaiDonHang).

Các hàm thường dùng:

createOrder(payload) – từ trang Checkout (gửi cart + address + payment).

getOrderDetail(id) – xem chi tiết 1 đơn hàng.

getMyOrders() – lịch sử đơn hàng của user trong trang Account.

(admin) getAllOrders, updateOrderStatus, v.v.

Ví dụ:

import { httpGet, httpPost } from "./http";
import type { Order } from "../interface/Order";

export type CreateOrderItem = {
perfumeId: number;
quantity: number;
unitPrice: number;
};

export type CreateOrderPayload = {
items: CreateOrderItem[];
paymentMethodId: number;
shippingAddress: string;
note?: string;
};

export async function createOrder(
payload: CreateOrderPayload
): Promise<Order> {
return httpPost<Order>("/orders", payload);
}

export async function getOrderDetail(id: number): Promise<Order> {
return httpGet<Order>(`/orders/${id}`);
}

export async function getMyOrders(): Promise<Order[]> {
return httpGet<Order[]>("/orders/me");
}

7.4. services/auth.ts – đăng nhập / profile

Làm việc với NguoiDung, VaiTroNguoiDung, v.v.

Các hàm chính:

login(credentials):

gửi email/password tới backend,

backend trả token (JWT) hoặc set cookie session,

lưu token vào localStorage (để http.ts gắn vào header).

logout():

xoá token, gọi API logout nếu cần.

getCurrentUser():

lấy thông tin user đang đăng nhập (dùng cho Header, AccountPage).

Ví dụ:

import { httpGet, httpPost } from "./http";
import type { User } from "../interface/User";

export type LoginPayload = {
email: string;
password: string;
};

export async function login(payload: LoginPayload): Promise<{ token: string }> {
const res = await httpPost<{ token: string }>("/auth/login", payload);
localStorage.setItem("access_token", res.token);
return res;
}

export async function logout(): Promise<void> {
await httpPost<void>("/auth/logout");
localStorage.removeItem("access_token");
}

export async function getCurrentUser(): Promise<User> {
return httpGet<User>("/auth/me");
}

Trong Header và AccountPage có thể dùng getCurrentUser() để hiển thị tên user, email, avatar…

8. src/interface/ – kiểu dữ liệu (TypeScript)

Đây là nơi define các interface/type tương ứng với model bên Spring Boot.

Ví dụ:

interface/Product.ts

PerfumeBase:

map với bảng NuocHoa + LoaiNuocHoa.

PerfumeDetail:

PerfumeBase + thông tin chi tiết từ ChiTietNuocHoa, DanhGia, HinhAnhNuocHoa (gallery, rating, soldCount...).

Các type này dùng chung ở:

services/product.ts (kiểu dữ liệu khi gọi API).

ProductCard, ProductDetailPage (props & state).

interface/Order.ts

Đại diện cho đơn hàng:

id, user, danh sách item, tổng tiền, trạng thái, phương thức thanh toán…

interface/User.ts

Thông tin người dùng:

id, name, email, role (USER / ADMIN), avatar, phone, v.v.

👉 Quy tắc:
Mọi dữ liệu nhận từ backend → define rõ trong interface/, sau đó sử dụng lại ở services/ và components.

9. Quy ước chung khi phát triển

Thêm page mới
→ Tạo file trong src/page/..., sau đó thêm route tương ứng trong navigator.tsx.

Thêm component mới
→ Đặt trong src/components/<nhóm>/
(vd: components/product, components/cart, components/form…).

Thêm API mới
→ Viết hàm trong src/services/... (dùng httpGet/httpPost/...),
→ Dùng lại hàm đó trong các page / component cần.

Thêm model mới từ backend
→ Tạo interface trong src/interface/...,
→ Dùng type đó cho cả services và components để có type-check end-to-end.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
