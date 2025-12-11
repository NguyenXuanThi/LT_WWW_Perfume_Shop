import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import type { PerfumeDetail } from "../../interface/Product";
import {
  buildImageUrl,
  formatGender,
  getFinalPrice,
} from "../../interface/Product";
import { useCart } from "../../components/cart/CartContext.tsx";

// API Response Type
interface ApiChiTietNuocHoa {
  nuocHoaId: number;
  hinhAnhChiTiet: string[];
  xuatXu?: string;
  namPhatHanh?: number;
  nhomHuong?: string;
  phongCachMuiHuong?: string;
  moTa?: string;
}

interface ApiNuocHoaDetailResponse {
  id: number;
  tenSanPham: string;
  thuongHieu: string;
  giaGoc: number;
  khuyenMai: number;
  hinhAnhChinh: string;
  dungTich: number;
  doiTuong: string;
  loaiNuocHoa?: number;
  chiTietNuocHoa?: ApiChiTietNuocHoa;
  mucDanhGia?: number;
}

// Map API response to PerfumeDetail
function mapApiToDetail(api: ApiNuocHoaDetailResponse): PerfumeDetail {
  const galleryImages = [
    api.hinhAnhChinh,
    ...(api.chiTietNuocHoa?.hinhAnhChiTiet || []),
  ];

  return {
    id: api.id,
    name: api.tenSanPham,
    brand: api.thuongHieu,
    basePrice: api.giaGoc,
    discountPercent: api.khuyenMai,
    mainImageFile: api.hinhAnhChinh,
    volume: api.dungTich,
    gender: api.doiTuong as "MALE" | "FEMALE" | "UNISEX",
    type: api.loaiNuocHoa ?? 1,
    origin: api.chiTietNuocHoa?.xuatXu,
    launchYear: api.chiTietNuocHoa?.namPhatHanh,
    scentGroup: api.chiTietNuocHoa?.nhomHuong,
    style: api.chiTietNuocHoa?.phongCachMuiHuong,
    description: api.chiTietNuocHoa?.moTa,
    galleryImages,
    averageRating: api.mucDanhGia,
  } as PerfumeDetail;
}

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(params.id);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<PerfumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [showAddedNotification, setShowAddedNotification] = useState(false);

  // Fetch product detail from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
            `http://localhost:8080/api/nuochoa/${productId}`
        );

        if (!res.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }

        const data: ApiNuocHoaDetailResponse = await res.json();
        const mappedProduct = mapApiToDetail(data);
        setProduct(mappedProduct);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // const finalPrice = getFinalPrice(product);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.basePrice,
        discountPercent: product.discountPercent,
        image: product.mainImageFile || "",
        volume: product.volume,
      });
    }

    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 300);
  };

  // Show loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-white text-slate-900">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-20 text-center">
            <p className="text-slate-600">Đang tải...</p>
          </main>
          <Footer />
        </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
        <div className="min-h-screen bg-white text-slate-900">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-20 text-center">
            <p className="text-red-600">{error || "Không tìm thấy sản phẩm"}</p>
          </main>
          <Footer />
        </div>
    );
  }

  const mainImageSrc = selectedImage
      ? buildImageUrl(selectedImage)
      : buildImageUrl(product.mainImageFile);

  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return (
      <div className="min-h-screen bg-white text-slate-900">
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-6">
          <nav className="mb-4 text-xs text-slate-500">
            <span className="cursor-pointer hover:text-red-600">Trang chủ</span>
            <span className="mx-1">/</span>
            <span className="cursor-pointer hover:text-red-600">
            Nước hoa {formatGender(product.gender).toLowerCase()}
          </span>
            <span className="mx-1">/</span>
            <span className="font-semibold text-slate-800">{product.name}</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[1.1fr,1.1fr,0.9fr]">
            <div>
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <img
                    src={mainImageSrc}
                    alt={product.name}
                    className="max-h-[360px] w-auto object-contain"
                />
              </div>

              {product.galleryImages.length > 1 && (
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs md:flex">
                      ‹
                    </button>
                    <div className="flex flex-1 justify-center gap-3 overflow-x-auto px-1 pb-1">
                      {product.galleryImages.map((img) => {
                        const selected = selectedImage === img;
                        return (
                            <button
                                key={img}
                                className={[
                                  "flex h-16 w-16 items-center justify-center rounded-lg border bg-white p-1",
                                  selected ? "border-red-600" : "border-slate-200",
                                ].join(" ")}
                                onClick={() => setSelectedImage(img)}
                            >
                              <img
                                  src={buildImageUrl(img)}
                                  alt={product.name}
                                  className="max-h-full w-auto object-contain"
                              />
                            </button>
                        );
                      })}
                    </div>
                    <button className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs md:flex">
                      ›
                    </button>
                  </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  {product.name}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 text-red-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                    ))}
                    <span className="ml-1 text-[11px] text-slate-600">
                    {product.ratingCount ?? 0} đánh giá
                  </span>
                  </div>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                  {formatGender(product.gender)}
                </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Thương hiệu:&nbsp;</span>
                  <span>{product.brand}</span>
                </p>
                <p>
                  <span className="font-semibold">Dung tích:&nbsp;</span>
                  <span>{product.volume}ml</span>
                </p>
                {product.scentGroup && (
                    <p>
                      <span className="font-semibold">Nhóm hương:&nbsp;</span>
                      <span>{product.scentGroup}</span>
                    </p>
                )}
                {product.style && (
                    <p>
                      <span className="font-semibold">Phong cách:&nbsp;</span>
                      <span>{product.style}</span>
                    </p>
                )}
                {product.origin && (
                    <p>
                      <span className="font-semibold">Xuất xứ:&nbsp;</span>
                      <span>{product.origin}</span>
                    </p>
                )}
                {product.launchYear && (
                    <p>
                      <span className="font-semibold">Năm phát hành:&nbsp;</span>
                      <span>{product.launchYear}</span>
                    </p>
                )}
              </div>

              {product.description && (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Mô tả:</p>
                    <p className="mt-1">{product.description}</p>
                  </div>
              )}

              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-xs text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Freeship toàn quốc cho đơn từ 1.000.000₫</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Cam kết hàng chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↺</span>
                  <span>Đổi trả miễn phí nếu lỗi từ nhà sản xuất</span>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Giá bán
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-semibold text-red-600">
                  {finalPrice.toLocaleString("vi-VN")}₫
                </span>
                  {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                    {product.basePrice.toLocaleString("vi-VN")}₫
                  </span>
                  )}
                  {hasDiscount && (
                      <span className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                    -{product.discountPercent}%
                  </span>
                  )}
                </div>

                {typeof product.stock === "number" && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Còn hàng ({product.stock} sản phẩm)
                    </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Số lượng
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <button
                      className="h-6 w-6 rounded-full text-center text-base text-slate-600 hover:bg-slate-100"
                      onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number(e.target.value))}
                      className="w-10 border-none bg-transparent text-center text-sm outline-none"
                  />
                  <button
                      className="h-6 w-6 rounded-full text-center text-base text-slate-600 hover:bg-slate-100"
                      onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-red-700"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex w-full items-center justify-center rounded-full border border-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50"
                >
                  Mua ngay
                </button>
              </div>

              <div className="border-t border-slate-200 pt-3 text-center text-[11px] text-slate-600">
                Gọi đặt mua{" "}
                <span className="font-semibold text-red-600">1900 0129</span>{" "}
                (9:00 - 21:00)
              </div>
            </aside>
          </section>
        </main>

        {/* Notification khi thêm vào giỏ */}
        {showAddedNotification && (
            <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg">
              ✓ Đã thêm vào giỏ hàng
            </div>
        )}

        <Footer />
      </div>
  );
};

export default ProductDetailPage;