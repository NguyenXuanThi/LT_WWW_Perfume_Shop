import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import HeroBanner from "../../components/home/HeroBanner";
import BrandStrip from "../../components/home/BrandStrip";
import ProductShelf from "../../components/home/ProductShelf";
import type { ProductCardProps } from "../../components/product/ProductCard";
import type { PerfumeDetail } from "../../interface/Product";
import { getFinalPrice } from "../../interface/Product";
import { getFeaturedProducts, buildImageUrl } from "../../services/productService";

// Map PerfumeDetail to ProductCardProps for the shelf component
const mapToCardProps = (p: PerfumeDetail, badge?: string): ProductCardProps => ({
  id: p.id,
  name: p.name,
  brand: p.brand.toUpperCase(),
  price: getFinalPrice(p),
  imageUrl: buildImageUrl(p.mainImageFile),
  volume: `${p.volume}ml`,
  badge: badge || (p.discountPercent > 0 ? `-${p.discountPercent}%` : undefined),
});

// Featured products type
interface FeaturedProducts {
  newArrivals: PerfumeDetail[];
  bestSellers: PerfumeDetail[];
  onSale: PerfumeDetail[];
  forMen: PerfumeDetail[];
  forWomen: PerfumeDetail[];
  unisex: PerfumeDetail[];
}

const HomePage = () => {
  // State for products
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    newArrivals: [],
    bestSellers: [],
    onSale: [],
    forMen: [],
    forWomen: [],
    unisex: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Map products to card props
  const newArrivals: ProductCardProps[] = featuredProducts.newArrivals.map(p => 
    mapToCardProps(p, "NEW")
  );

  const bestSellers: ProductCardProps[] = featuredProducts.bestSellers.map((p, index) => 
    mapToCardProps(p, index < 3 ? "HOT" : undefined)
  );

  const onSale: ProductCardProps[] = featuredProducts.onSale.map(p => 
    mapToCardProps(p, `-${p.discountPercent}%`)
  );

  const forMen: ProductCardProps[] = featuredProducts.forMen.map(p => mapToCardProps(p));
  const forWomen: ProductCardProps[] = featuredProducts.forWomen.map(p => mapToCardProps(p));
  const unisex: ProductCardProps[] = featuredProducts.unisex.map(p => mapToCardProps(p));

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{ minWidth: "100vw" }}
    >
      <Header />

      <main className="mx-auto max-w-6xl px-4">
        <HeroBanner />
        <BrandStrip />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-red-600"></div>
              <p className="mt-4 text-sm text-slate-500">Đang tải sản phẩm...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 my-8 text-center">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Product Sections - Only show when loaded */}
        {!loading && !error && (
          <>
            {/* New Arrivals Section */}
            {newArrivals.length > 0 && (
              <ProductShelf
                title="Hàng mới về"
                label="New Arrivals"
                subtitle="Những mùi hương vừa cập bến cửa hàng."
                products={newArrivals}
                seeAllLink="/nuoc-hoa/nam"
              />
            )}

            {/* Bestsellers Section */}
            {bestSellers.length > 0 && (
              <ProductShelf
                title="Bán chạy nhất"
                label="Bestsellers"
                subtitle="Top nước hoa được yêu thích nhất."
                products={bestSellers}
                seeAllLink="/nuoc-hoa/nam"
              />
            )}

            {/* On Sale Section */}
            {onSale.length > 0 && (
              <ProductShelf
                title="Đang giảm giá"
                label="Sale"
                subtitle="Ưu đãi hấp dẫn không thể bỏ lỡ."
                products={onSale}
                seeAllLink="/nuoc-hoa/nam"
              />
            )}

            {/* For Men Section */}
            {forMen.length > 0 && (
              <ProductShelf
                title="Nước hoa nam"
                label="For Him"
                subtitle="Mạnh mẽ, lịch lãm, đầy cuốn hút."
                products={forMen}
                seeAllLink="/nuoc-hoa/nam"
              />
            )}

            {/* For Women Section */}
            {forWomen.length > 0 && (
              <ProductShelf
                title="Nước hoa nữ"
                label="For Her"
                subtitle="Quyến rũ, ngọt ngào, đầy nữ tính."
                products={forWomen}
                seeAllLink="/nuoc-hoa/nu"
              />
            )}

            {/* Unisex Section */}
            {unisex.length > 0 && (
              <ProductShelf
                title="Nước hoa unisex"
                label="Unisex"
                subtitle="Phong cách tự do, không giới hạn."
                products={unisex}
                seeAllLink="/nuoc-hoa/unisex"
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

