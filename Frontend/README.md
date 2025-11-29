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

7. src/services/ – gọi API (kết nối Spring Boot)

Đây là nơi gọi backend Spring Boot (Gradle).

services/http.ts

File “client” chung:

Tạo instance fetch hoặc axios với baseURL trỏ đến backend (http://localhost:8080/api).

Xử lý:

Thêm Authorization header nếu có token.

Bắt lỗi chung (401, 500…).

services/product.ts

Gồm các hàm làm việc với sản phẩm:

getProducts()

getProductById(id)

createProduct(payload) (admin)

updateProduct(id, payload)

deleteProduct(id)

services/order.ts

Gồm các hàm gọi API đơn hàng:

createOrder(payload) (từ CheckoutPage)

getOrderById(id)

getOrdersByUser(userId) (My Account)

v.v.

services/auth.ts

Đăng nhập / đăng ký / lấy thông tin user:

login(credentials)

logout()

getProfile()

👉 Quy tắc:
Không gọi API trực tiếp trong component nếu có thể. Component chỉ gọi hàm từ services/....

8. src/interface/ – kiểu dữ liệu (TypeScript)

Đây là nơi khai báo các interface / type tương ứng với model bên Spring Boot.

interface/Product.ts
export interface Product {
  id: number
  name: string
  brand: string
  description: string
  price: number
  stock: number
  imageUrl: string
}

interface/Order.ts

Đại diện cho đơn hàng: id, user, danh sách item, tổng tiền, trạng thái…

interface/User.ts

Thông tin người dùng: id, name, email, role (USER / ADMIN), v.v.

👉 Quy tắc:
Mọi dữ liệu nhận từ backend → define rõ trong interface/, sau đó dùng ở services và components.

9. Quy ước chung khi phát triển

Thêm page mới: tạo trong src/page/..., sau đó khai báo route trong navigator.tsx.

Thêm component mới: đặt trong src/components/<nhóm>/ (vd: product, cart, form…).

Thêm API mới: viết hàm trong src/services/... và dùng lại ở các page cần.

Thêm model mới từ backend: tạo file hoặc thêm vào src/interface/....



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
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
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
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
