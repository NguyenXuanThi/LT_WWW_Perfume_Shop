import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import type { CartItem } from "../../components/cart/CartContext";

export default function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderInfo = location.state?.orderInfo;

    if (!orderInfo) {
        return (
            <div className="min-h-screen bg-white text-slate-900">
                <Header />
                <main className="mx-auto max-w-6xl px-4 py-20 text-center">
                    <p className="text-red-600">Không tìm thấy thông tin đơn hàng</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Về trang chủ
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />

            <main className="mx-auto max-w-3xl px-4 py-12">
                {/* Success Icon */}
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="h-12 w-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-slate-900">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-slate-600">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi đã gửi email xác nhận đến{" "}
                        <span className="font-medium text-slate-900">{orderInfo.email}</span>
                    </p>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Thông tin đơn hàng
                        </h2>
                        <span className="text-sm font-medium text-red-600">
              {orderInfo.orderId}
            </span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Người nhận:</span>
                            <span className="font-medium text-slate-900">
                {orderInfo.fullName}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Số điện thoại:</span>
                            <span className="font-medium text-slate-900">
                {orderInfo.phone}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Email:</span>
                            <span className="font-medium text-slate-900">
                {orderInfo.email}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Địa chỉ:</span>
                            <span className="font-medium text-right text-slate-900">
                {orderInfo.address}
                                {orderInfo.ward && `, ${orderInfo.ward}`}
                                {orderInfo.district && `, ${orderInfo.district}`}
                                {orderInfo.city && `, ${orderInfo.city}`}
              </span>
                        </div>
                    </div>

                    {/* Sản phẩm */}
                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <h3 className="mb-3 font-semibold text-slate-900">
                            Sản phẩm ({orderInfo.items.length})
                        </h3>
                        <div className="space-y-3">
                            {orderInfo.items.map((item: CartItem) => {
                                const finalPrice = item.price * (1 - item.discountPercent / 100);
                                return (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <img
                                            src={`/images/${item.image}`}
                                            alt={item.name}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                            <p className="text-slate-500">
                                                {finalPrice.toLocaleString("vi-VN")}₫ x {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium text-slate-900">
                                            {(finalPrice * item.quantity).toLocaleString("vi-VN")}₫
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tổng tiền */}
                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <div className="flex justify-between text-base font-semibold text-slate-900">
                            <span>Tổng thanh toán:</span>
                            <span className="text-red-600">
                {orderInfo.total.toLocaleString("vi-VN")}₫
              </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Tiếp tục mua sắm
                    </button>
                    <button
                        onClick={() => navigate("/orders")}
                        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Xem đơn hàng của tôi
                    </button>
                </div>

                {/* Note */}
                <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">📧 Lưu ý:</p>
                    <ul className="ml-4 mt-2 list-disc space-y-1">
                        <li>
                            Email xác nhận đã được gửi đến <strong>{orderInfo.email}</strong>
                        </li>
                        <li>Đơn hàng sẽ được xử lý trong vòng 24h</li>
                        <li>Thời gian giao hàng dự kiến: 2-3 ngày làm việc</li>
                        <li>Bạn có thể theo dõi đơn hàng tại mục "Đơn hàng của tôi"</li>
                    </ul>
                </div>
            </main>

            <Footer />
        </div>
    );
}