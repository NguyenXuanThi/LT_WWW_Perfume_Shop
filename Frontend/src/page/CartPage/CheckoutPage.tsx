import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../components/cart/CartContext";
import { useStore } from "@/store";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { selectedItems, selectedTotal, clearCart } = useCart();
    const { user } = useStore();

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!user) {
            alert("Vui lòng đăng nhập để thanh toán");
            navigate("/login");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        note: "",
    });

    // Auto-fill thông tin từ user đã đăng nhập
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.hoTen || "",
                phone: user.soDienThoai || "",
                email: user.email || "",
                address: user.diaChi || "",
                city: "",
                district: "",
                ward: "",
                note: "",
            });
        }
    }, [user]);

    const [showQR, setShowQR] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        setShowQR(true);
    };

    const handlePaymentSuccess = async () => {
        setIsPaying(true);

        // Giả lập thanh toán
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Gửi email (giả lập)
        try {
            // Ở đây bạn sẽ gọi API backend để gửi email
            console.log("Sending order confirmation email to:", formData.email);
            console.log("Order details:", {
                customer: formData,
                items: selectedItems,
                total: selectedTotal,
            });

            // Xóa giỏ hàng
            clearCart();

            // Chuyển sang trang thành công
            navigate("/order-success", {
                state: {
                    orderInfo: {
                        ...formData,
                        items: selectedItems,
                        total: selectedTotal,
                        orderId: `DH${Date.now()}`,
                    },
                },
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setIsPaying(false);
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="min-h-screen bg-white text-slate-900">
                <Header />
                <main className="mx-auto max-w-6xl px-4 py-20 text-center">
                    <p className="text-red-600">Không có sản phẩm nào được chọn</p>
                    <button
                        onClick={() => navigate("/cart")}
                        className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Quay lại giỏ hàng
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
                    Thanh toán
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    {/* Form thông tin */}
                    <div className="space-y-6">
                        {/* Thông tin người nhận */}
                        <div className="rounded-lg border border-slate-200 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">
                                Thông tin người nhận
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Họ và tên <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Số điện thoại <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                            placeholder="0901234567"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ giao hàng */}
                        <div className="rounded-lg border border-slate-200 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">
                                Địa chỉ giao hàng
                            </h2>

                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Tỉnh/Thành phố
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                            placeholder="TP. Hồ Chí Minh"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Quận/Huyện
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                            placeholder="Quận 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Phường/Xã
                                        </label>
                                        <input
                                            type="text"
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                            placeholder="Phường Bến Nghé"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Địa chỉ cụ thể <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                        placeholder="Số nhà, tên đường..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Ghi chú đơn hàng
                                    </label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                                        placeholder="Ghi chú thêm (tùy chọn)..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <aside className="h-fit space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Đơn hàng ({selectedItems.length} sản phẩm)
                        </h2>

                        <div className="max-h-64 space-y-3 overflow-y-auto">
                            {selectedItems.map((item) => {
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
                                            <p className="text-xs text-slate-500">
                                                {finalPrice.toLocaleString("vi-VN")}₫ x {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between text-slate-700">
                                <span>Tạm tính</span>
                                <span>{selectedTotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                                <span>Tổng cộng</span>
                                <span className="text-red-600">
                  {selectedTotal.toLocaleString("vi-VN")}₫
                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Đặt hàng
                        </button>

                        <p className="text-center text-xs text-slate-500">
                            Bằng việc đặt hàng, bạn đồng ý với{" "}
                            <span className="text-red-600">Điều khoản sử dụng</span>
                        </p>
                    </aside>
                </form>
            </main>

            {/* Modal QR Payment */}
            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6">
                        <button
                            onClick={() => setShowQR(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="mb-4 text-center text-xl font-semibold text-slate-900">
                            Thanh toán QR Code
                        </h2>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                            {/* QR Code giả lập */}
                            <div className="mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-lg bg-white">
                                <svg className="h-48 w-48" viewBox="0 0 100 100">
                                    <rect width="100" height="100" fill="white" />
                                    <rect x="5" y="5" width="20" height="20" fill="black" />
                                    <rect x="35" y="5" width="20" height="20" fill="black" />
                                    <rect x="65" y="5" width="20" height="20" fill="black" />
                                    <rect x="5" y="35" width="20" height="20" fill="black" />
                                    <rect x="35" y="35" width="20" height="20" fill="black" />
                                    <rect x="65" y="35" width="20" height="20" fill="black" />
                                    <rect x="5" y="65" width="20" height="20" fill="black" />
                                    <rect x="35" y="65" width="20" height="20" fill="black" />
                                    <rect x="65" y="65" width="20" height="20" fill="black" />
                                </svg>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-slate-700">Số tiền thanh toán</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {selectedTotal.toLocaleString("vi-VN")}₫
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                    Quét mã QR để thanh toán
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handlePaymentSuccess}
                            disabled={isPaying}
                            className="mt-6 w-full rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-slate-300"
                        >
                            {isPaying ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}