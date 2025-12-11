import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../components/cart/CartContext";
import { useStore } from "@/store";

export default function CartPage() {
    const navigate = useNavigate();
    const { user } = useStore();
    const {
        items,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        selectedItems,
        selectedTotal,
        allSelected,
    } = useCart();

    const getFinalPrice = (item: typeof items[0]) => {
        return item.price * (1 - item.discountPercent / 100);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
            return;
        }

        // Kiểm tra đăng nhập
        if (!user) {
            alert("Vui lòng đăng nhập để thanh toán");
            navigate("/login");
            return;
        }

        navigate("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white text-slate-900">
                <Header />
                <main className="mx-auto max-w-6xl px-4 py-20 text-center">
                    <svg
                        className="mx-auto h-24 w-24 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">
                        Giỏ hàng trống
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Chưa có sản phẩm nào trong giỏ hàng của bạn
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Tiếp tục mua sắm
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />

            <main className="mx-auto max-w-6xl px-4 py-6">
                <h1 className="mb-6 text-2xl font-semibold text-slate-900">
                    Giỏ hàng ({items.length} sản phẩm)
                </h1>

                <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
                    {/* Danh sách sản phẩm */}
                    <div className="space-y-4">
                        {/* Header checkbox chọn tất cả */}
                        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="h-4 w-4 rounded border-slate-300 text-red-600"
                            />
                            <span className="text-sm font-medium text-slate-700">
                Chọn tất cả ({items.length})
              </span>
                        </div>

                        {/* Danh sách items */}
                        {items.map((item) => {
                            const finalPrice = getFinalPrice(item);
                            const itemTotal = finalPrice * item.quantity;

                            return (
                                <div
                                    key={item.id}
                                    className="flex gap-4 rounded-lg border border-slate-200 p-4"
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleSelect(item.id)}
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600"
                                    />

                                    {/* Hình ảnh */}
                                    <img
                                        src={`/images/${item.image}`}
                                        alt={item.name}
                                        className="h-24 w-24 rounded object-cover"
                                    />

                                    {/* Thông tin */}
                                    <div className="flex flex-1 flex-col">
                                        <h3 className="font-medium text-slate-900">{item.name}</h3>
                                        <p className="text-xs text-slate-500">
                                            {item.brand} • {item.volume}ml
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-red-600">
                        {finalPrice.toLocaleString("vi-VN")}₫
                      </span>
                                            {item.discountPercent > 0 && (
                                                <>
                          <span className="text-xs text-slate-400 line-through">
                            {item.price.toLocaleString("vi-VN")}₫
                          </span>
                                                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600">
                            -{item.discountPercent}%
                          </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            {/* Số lượng */}
                                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    className="h-6 w-6 rounded-full text-slate-600 hover:bg-slate-100"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    className="h-6 w-6 rounded-full text-slate-600 hover:bg-slate-100"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Tổng tiền item */}
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Tổng</p>
                                                <p className="font-semibold text-slate-900">
                                                    {itemTotal.toLocaleString("vi-VN")}₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút xóa */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-slate-400 hover:text-red-600"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <aside className="h-fit space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Tóm tắt đơn hàng
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-700">
                                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                <span>{selectedTotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-3">
                            <div className="flex justify-between text-base font-semibold text-slate-900">
                                <span>Tổng cộng</span>
                                <span className="text-red-600">
                  {selectedTotal.toLocaleString("vi-VN")}₫
                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                            className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {user ? `Thanh toán (${selectedItems.length})` : "Đăng nhập để thanh toán"}
                        </button>

                        {!user && (
                            <p className="text-center text-xs text-slate-600">
                                Bạn cần đăng nhập để tiếp tục thanh toán
                            </p>
                        )}

                        <button
                            onClick={() => navigate("/")}
                            className="w-full text-center text-xs text-slate-600 hover:text-red-600"
                        >
                            ← Tiếp tục mua sắm
                        </button>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}