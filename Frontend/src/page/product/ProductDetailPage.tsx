import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import type { PerfumeDetail } from "../../interface/Product";
import {
  buildImageUrl,
  formatGender,
  getFinalPrice,
} from "../../interface/Product";

const MOCK_DETAIL: PerfumeDetail = {
  id: 3,
  name: "Versace Eros",
  brand: "Versace",
  basePrice: 2_100_000,
  discountPercent: 15,
  mainImageFile: "versace_eros.jpg",
  volume: 100,
  gender: "MALE",
  type: {
    id: 2,
    code: "EDT",
    description: "Eau de Toilette",
    oilConcentration: "5-15%",
    longevity: "4-6h",
    sillage: "Gần",
  },
  origin: "Italy",
  launchYear: 2012,
  scentGroup: "Fougere",
  style: "Cuốn hút",
  description:
    "Hương thơm tươi mát, cuốn hút, mang cảm hứng thần tình yêu Hy Lạp.",
  galleryImages: [
    "versace_eros.jpg",
    "versace_eros_1.jpg",
    "versace_eros_2.jpg",
  ],
  averageRating: 4.8,
  ratingCount: 103,
  soldCount: 250,
  stock: 42,
};

type SizeOption = {
  id: number;
  label: string;
  volume: number;
};

const standardSizes: SizeOption[] = [
  { id: 3, label: "Eau de Toilette 100ml", volume: 100 },
  { id: 31, label: "Eau de Toilette 200ml", volume: 200 },
];
const miniSizes: SizeOption[] = [
  { id: 32, label: "Eau de Toilette 5ml", volume: 5 },
];

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const product: PerfumeDetail = useMemo(() => {
    return MOCK_DETAIL;
  }, [productId]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStandardSize, setSelectedStandardSize] = useState<number>(
    standardSizes[0]?.id
  );
  const [selectedMiniSize, setSelectedMiniSize] = useState<number | null>(
    miniSizes[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const mainImageSrc = selectedImage
    ? buildImageUrl(selectedImage)
    : buildImageUrl(product.mainImageFile);

  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    setQuantity(value);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-4 text-xs text-slate-500">
          <span className="cursor-pointer hover:text-red-600">Trang chủ</span>
          <span className="mx-1">/</span>
          <span className="cursor-pointer hover:text-red-600">
            Nước hoa nam
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
                <span className="font-semibold">Loại:&nbsp;</span>
                <span>
                  {product.type.description || product.type.code}{" "}
                  {product.volume}ml
                </span>
              </p>
              {product.scentGroup && (
                <p>
                  <span className="font-semibold">Nhóm hương:&nbsp;</span>
                  <span>{product.scentGroup}</span>
                </p>
              )}
              {product.origin && (
                <p>
                  <span className="font-semibold">Xuất xứ:&nbsp;</span>
                  <span>{product.origin}</span>
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Standard Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {standardSizes.map((s) => {
                    const selected = selectedStandardSize === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStandardSize(s.id)}
                        className={[
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                          selected
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-slate-200 text-slate-700 hover:border-red-400",
                        ].join(" ")}
                      >
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mini Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {miniSizes.map((s) => {
                    const selected = selectedMiniSize === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedMiniSize(s.id)}
                        className={[
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                          selected
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-slate-200 text-slate-700 hover:border-red-400",
                        ].join(" ")}
                      >
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

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
              <button className="flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-red-700">
                Thêm vào giỏ hàng
              </button>
              <button className="flex w-full items-center justify-center rounded-full border border-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50">
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

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
