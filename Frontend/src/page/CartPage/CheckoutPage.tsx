import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../components/cart/CartContext";
import { useStore } from "@/store";
import axios from "axios";

// API Configuration
const API_BASE_URL = "http://localhost:8080/api";

const axiosPublic = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

interface DonHangRequest {
    ngayDat: string; // YYYY-MM-DD
    thanhTien: number;
    phuongThucThanhToan: string;
    diaChiGiaoHang: string;
    soDienThoai: string;
    ghiChu?: string;
    thueVAT: number;
    phiVanChuyen: number;
    taiKhoan: number; // Chỉ gửi ID
    chiTietDonHangs: ChiTietDonHangRequest[];
}

interface ChiTietDonHangRequest {
    nuocHoa: number; // Chỉ gửi ID
    soLuong: number;
    donGia: number;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { selectedItems, selectedTotal, clearCart } = useCart();
    const { user } = useStore();

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            alert("Vui lòng đăng nhập để thanh toán");
            navigate("/login");
        }
    }, [user, navigate]);

    // Redirect if no items selected
    useEffect(() => {
        if (selectedItems.length === 0 && user) {
            navigate("/cart");
        }
    }, [selectedItems, user, navigate]);

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

    // Auto-fill from user data
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
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Email không hợp lệ");
            return;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Số điện thoại phải có 10 chữ số");
            return;
        }

        setShowQR(true);
    };

    const handlePaymentSuccess = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thanh toán");
            navigate("/login");
            return;
        }

        setIsPaying(true);
        setError(null);

        try {
            // Build full address
            const fullAddress = [
                formData.address,
                formData.ward,
                formData.district,
                formData.city
            ].filter(Boolean).join(", ");

            // Calculate totals
            const thueVAT = 0; // 0% VAT
            const phiVanChuyen = 0; // Free shipping
            const tongTienHang = selectedItems.reduce((sum, item) => {
                const finalPrice = item.price * (1 - item.discountPercent / 100);
                return sum + (finalPrice * item.quantity);
            }, 0);
            const thanhTien = tongTienHang + thueVAT + phiVanChuyen;

            // Prepare chi tiet don hang
            const chiTietDonHangs: ChiTietDonHangRequest[] = selectedItems.map(item => {
                const donGia = item.price * (1 - item.discountPercent / 100);

                return {
                    nuocHoa: item.id, // Chỉ gửi ID
                    soLuong: item.quantity,
                    donGia: donGia,
                };
            });

            // Prepare order data
            const donHangRequest: DonHangRequest = {
                ngayDat: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                thanhTien: thanhTien,
                phuongThucThanhToan: "QR Code",
                diaChiGiaoHang: fullAddress,
                soDienThoai: formData.phone,
                ghiChu: formData.note || undefined,
                thueVAT: thueVAT,
                phiVanChuyen: phiVanChuyen,
                taiKhoan: user.id, // Chỉ gửi ID
                chiTietDonHangs: chiTietDonHangs
            };

            console.log("Creating order:", donHangRequest);

            // Call API to create order using axios
            const response = await axiosPublic.post('/test/donHang', donHangRequest);

            const createdOrder = response.data;
            console.log("Order created successfully:", createdOrder);

            try {
                const emailData = {
                    to: formData.email,
                    subject: `Xác nhận đơn hàng #${createdOrder.id || 'DH' + Date.now()}`,
                    body: `
            <h2>Cảm ơn bạn đã đặt hàng tại Perfume Boutique!</h2>
            <p>Xin chào <strong>${formData.fullName}</strong>,</p>
            <p>Đơn hàng của bạn đã được đặt thành công.</p>
            
            <h3>Thông tin đơn hàng:</h3>
            <ul>
              <li>Mã đơn hàng: <strong>#${createdOrder.id || 'DH' + Date.now()}</strong></li>
              <li>Ngày đặt: <strong>${new Date().toLocaleDateString('vi-VN')}</strong></li>
              <li>Tổng tiền: <strong>${thanhTien.toLocaleString('vi-VN')}₫</strong></li>
              <li>Địa chỉ giao hàng: <strong>${fullAddress}</strong></li>
            </ul>
            
            <h3>Sản phẩm:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sản phẩm</th>
                  <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Số lượng</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Đơn giá</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${selectedItems.map(item => {
                        const finalPrice = item.price * (1 - item.discountPercent / 100);
                        const itemTotal = finalPrice * item.quantity;
                        return `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.name} - ${item.brand}</td>
                      <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${finalPrice.toLocaleString('vi-VN')}₫</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${itemTotal.toLocaleString('vi-VN')}₫</td>
                    </tr>
                  `;
                    }).join('')}
              </tbody>
            </table>
            
            <p style="margin-top: 20px;">
              Đơn hàng sẽ được xử lý trong vòng 24h và giao đến bạn trong 2-3 ngày làm việc.
            </p>
            
            <p>Trân trọng,<br/>Perfume Boutique Team</p>
          `
                };

                // Gọi API gửi email (cần tạo endpoint này ở backend)
                await axiosPublic.post('/email/send', emailData);

                console.log("Email notification sent successfully");
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // Không block flow nếu email fail
            }

            // Clear cart after successful order
            clearCart();

            // Navigate to success page
            navigate("/order-success", {
                state: {
                    orderInfo: {
                        orderId: createdOrder.id || `DH${Date.now()}`,
                        fullName: formData.fullName,
                        phone: formData.phone,
                        email: formData.email,
                        address: fullAddress,
                        city: formData.city,
                        district: formData.district,
                        ward: formData.ward,
                        items: selectedItems,
                        total: thanhTien,
                    },
                },
            });
        } catch (error) {
            console.error("Error creating order:", error);

            let errorMessage = "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.";

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error
                    errorMessage = error.response.data?.message || errorMessage;
                    console.error("Error response:", error.response.data);
                } else if (error.request) {
                    // Request made but no response
                    errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsPaying(false);
        }
    };

    // Don't render if not logged in (will redirect)
    if (!user) {
        return null;
    }

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
                                            pattern="[0-9]{10}"
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
                            disabled={isPaying}
                            className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {isPaying ? "Đang xử lý..." : "Đặt hàng"}
                        </button>

                        <p className="text-center text-xs text-slate-500">
                            Bằng việc đặt hàng, bạn đồng ý với{" "}
                            <span className="text-red-600">Điều khoản sử dụng</span>
                        </p>
                    </aside>
                </form>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
            </main>

            {/* Modal QR Payment */}
            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6">
                        <button
                            onClick={() => setShowQR(false)}
                            disabled={isPaying}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed"
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
                            className="mt-6 w-full rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
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