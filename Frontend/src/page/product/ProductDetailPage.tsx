import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard, {
  type ProductCardProps,
} from "../../components/product/ProductCard";
import type { PerfumeDetail } from "../../interface/Product";
import {
  formatGender,
  getFinalPrice,
} from "../../interface/Product";
import {
  getProductById,
  getRelatedProducts,
  buildImageUrl,
  genderToUrlParam,
} from "../../services/productService";
import { useCart } from "../../components/cart/CartContext";

type SizeOption = {
  id: number;
  label: string;
  volume: number;
};

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(params.id);
  const { addToCart } = useCart();

  // State for product data
  const [product, setProduct] = useState<PerfumeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for related products
  const [relatedProducts, setRelatedProducts] = useState<PerfumeDetail[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(false);

  // UI states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStandardSize, setSelectedStandardSize] = useState<number>(0);
  const [selectedMiniSize, setSelectedMiniSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;

      try {
        setLoadingRelated(true);
        const related = await getRelatedProducts(
            product.id,
            product.brand,
            product.gender,
            6
        );
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product]);

  // Generate size options based on product
  const standardSizes: SizeOption[] = useMemo(() => {
    if (!product) return [];
    return [
      { id: product.id, label: `${product.type?.code || "EDP"} ${product.volume}ml`, volume: product.volume },
    ];
  }, [product]);

  const miniSizes: SizeOption[] = useMemo(() => {
    if (!product) return [];
    // Only show mini size if volume > 30ml
    if (product.volume > 30) {
      return [
        { id: product.id * 100, label: `${product.type?.code || "EDP"} 5ml`, volume: 5 },
      ];
    }
    return [];
  }, [product]);

  // Set default selected size
  useEffect(() => {
    if (standardSizes.length > 0) {
      setSelectedStandardSize(standardSizes[0].id);
    }
    if (miniSizes.length > 0) {
      setSelectedMiniSize(miniSizes[0].id);
    }
  }, [standardSizes, miniSizes]);

  const mainImageSrc = useMemo(() => {
    if (!product) return "/images/placeholder-perfume.jpg";
    return selectedImage
        ? buildImageUrl(selectedImage)
        : buildImageUrl(product.mainImageFile);
  }, [product, selectedImage]);

  const finalPrice = product ? getFinalPrice(product) : 0;
  const hasDiscount = product ? product.discountPercent > 0 : false;

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    setQuantity(value);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    // Determine which size is being added
    const selectedSize = selectedStandardSize || selectedMiniSize;
    const selectedVolume = selectedStandardSize
        ? product.volume
        : 5; // Mini size is always 5ml

    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedSize!,
        name: product.name,
        brand: product.brand,
        price: product.basePrice,
        discountPercent: product.discountPercent,
        image: product.mainImageFile,
        volume: selectedVolume,
      });
    }

    // Optional: Show success message
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;

    const selectedSize = selectedStandardSize || selectedMiniSize;
    const selectedVolume = selectedStandardSize
        ? product.volume
        : 5;

    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedSize!,
        name: product.name,
        brand: product.brand,
        price: product.basePrice,
        discountPercent: product.discountPercent,
        image: product.mainImageFile,
        volume: selectedVolume,
      });
    }

    // Navigate to cart
    navigate("/cart");
  };

  // Map product to card props for related products
  const mapToCardProps = (p: PerfumeDetail): ProductCardProps => ({
    id: p.id,
    name: p.name,
    brand: p.brand.toUpperCase(),
    price: getFinalPrice(p),
    imageUrl: buildImageUrl(p.mainImageFile),
    volume: `${p.volume}ml`,
    badge: p.discountPercent > 0 ? `-${p.discountPercent}%` : undefined,
    basePrice: p.basePrice,
    discountPercent: p.discountPercent,
  });

  // Loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-white text-slate-900">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-red-600"></div>
                <p className="mt-4 text-sm text-slate-500">Đang tải thông tin sản phẩm...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
        <div className="min-h-screen bg-white text-slate-900">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-lg font-semibold text-red-800">{error || "Không tìm thấy sản phẩm"}</p>
              <Link
                  to="/nuoc-hoa/nam"
                  className="mt-4 inline-block text-sm font-semibold text-red-600 hover:text-red-700"
              >
                ← Quay về trang sản phẩm
              </Link>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-white text-slate-900">
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-6">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-slate-500">
            <Link to="/" className="cursor-pointer hover:text-red-600">Trang chủ</Link>
            <span className="mx-1">/</span>
            <Link
                to={`/nuoc-hoa/${genderToUrlParam(product.gender)}`}
                className="cursor-pointer hover:text-red-600"
            >
              Nước hoa {formatGender(product.gender).toLowerCase()}
            </Link>
            <span className="mx-1">/</span>
            <span className="font-semibold text-slate-800">{product.name}</span>
          </nav>

          {/* Product Detail Section */}
          <section className="grid gap-8 lg:grid-cols-[1.1fr,1.1fr,0.9fr]">
            {/* Image Gallery */}
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

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  {product.name}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 text-red-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.round(product.averageRating ?? 0) ? "" : "opacity-30"}>★</span>
                    ))}
                    <span className="ml-1 text-[11px] text-slate-600">
                    ({product.averageRating?.toFixed(1) ?? "0"}) {product.ratingCount ?? 0} đánh giá
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
                  {product.type?.description || product.type?.code || "N/A"}{" "}
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
                {product.launchYear && (
                    <p>
                      <span className="font-semibold">Năm ra mắt:&nbsp;</span>
                      <span>{product.launchYear}</span>
                    </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                      Mô tả
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                  </div>
              )}

              {/* Size Options */}
              <div className="space-y-3 text-sm">
                {standardSizes.length > 0 && (
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
                )}

                {miniSizes.length > 0 && (
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
                )}
              </div>

              {/* Shipping Info */}
              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-xs text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Freeship toàn quốc cho đơn từ 1.000.000₫</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✔</span>
                  <span>Cam kết hàng chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↺</span>
                  <span>Đổi trả miễn phí nếu lỗi từ nhà sản xuất</span>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Giá bán
                </p>
                <div className="mt-1 flex items-baseline gap-2 justify-center">
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
                      className="rounded-full text-center text-base text-slate-600 hover:bg-slate-100" style={{padding: "0.1rem 1rem"}}
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
                      className="rounded-full text-center text-base text-slate-600 hover:bg-slate-100" style={{padding: "0.1rem 1rem"}}
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

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
              <section className="mt-12 border-t border-slate-200 pt-8">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                <span className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Gợi ý
                </span>
                    <h2 className="text-lg font-semibold text-slate-900">Sản phẩm liên quan</h2>
                    <p className="text-xs text-slate-500">Có thể bạn cũng thích</p>
                  </div>
                  <Link
                      to={`/nuoc-hoa/${genderToUrlParam(product.gender)}`}
                      className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 hover:text-red-600"
                  >
                    Xem tất cả →
                  </Link>
                </div>

                {loadingRelated ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      {relatedProducts.map((p) => (
                          <Link key={p.id} to={`/product/${p.id}`} className="block">
                            <ProductCard {...mapToCardProps(p)} />
                          </Link>
                      ))}
                    </div>
                )}
              </section>
          )}
        </main>

        <Footer />
      </div>
  );
};

export default ProductDetailPage;