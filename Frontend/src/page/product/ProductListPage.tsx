import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard, {
  type ProductCardProps,
} from "../../components/product/ProductCard";

import type { Gender, PerfumeDetail } from "../../interface/Product";
import { getFinalPrice, buildImageUrl } from "../../interface/Product";
import { getAllProducts } from "../../services/productService";

// Wrapper function for fetching all perfumes
const getAllPerfumes = async (): Promise<PerfumeDetail[]> => {
  return getAllProducts();
};

type SortOption = "BEST_SELLING" | "PRICE_ASC" | "PRICE_DESC" | "NEWEST";

type CategoryFilter = "ALL" | "NEW_ARRIVALS" | "BEST_SELLERS" | "ON_SALE";

type PriceFilter =
  | "ALL"
  | "UNDER_2M"
  | "FROM_2_TO_4"
  | "FROM_4_TO_6"
  | "ABOVE_6";

type GenderConfig = {
  gender: Gender | "ALL";
  title: string;
  breadcrumb: string;
  description: string; 
};

const GENDER_CONFIGS: Record<string, GenderConfig> = {
  "tat-ca": {
    gender: "ALL",
    title: "Tất cả sản phẩm",
    breadcrumb: "Tất cả",
    description:
      "Khám phá thế giới nước hoa đa dạng và phong phú. Tại đây bạn sẽ tìm thấy tất cả những mùi hương tuyệt vời nhất dành cho mọi phong cách và cá tính.",
  },
  nam: {
    gender: "MALE",
    title: "Nước hoa nam",
    breadcrumb: "Nước hoa nam",
    description:
      "Các quý ông đang tìm đến nước hoa để làm gì? Có lẽ là để thơm hơn, nam tính và làm chỉn chu thêm phong cách của bản thân. Shop hiểu các quý ông của chúng ta: một chai nước hoa cho công việc mỗi ngày, một chai cho các buổi hẹn hò hoặc những dịp đặc biệt.",
  },
  nu: {
    gender: "FEMALE",
    title: "Nước hoa nữ",
    breadcrumb: "Nước hoa nữ",
    description:
      "Khám phá bộ sưu tập nước hoa nữ đa dạng từ các thương hiệu hàng đầu thế giới. Từ hương hoa ngọt ngào đến những mùi hương quyến rũ, tinh tế - mỗi chai nước hoa là một câu chuyện riêng dành cho phái đẹp.",
  },
  unisex: {
    gender: "UNISEX",
    title: "Nước hoa unisex",
    breadcrumb: "Nước hoa unisex",
    description:
      "Nước hoa unisex - sự lựa chọn hoàn hảo cho những ai yêu thích phong cách tự do, không giới hạn. Những mùi hương trung tính, tinh tế phù hợp cho cả nam và nữ, mang đến sự thanh lịch và cá tính riêng biệt.",
  },
};

const DEFAULT_GENDER_CONFIG = GENDER_CONFIGS.nam;

function mapPerfumeToCardProps(p: PerfumeDetail): ProductCardProps {
  const finalPrice = getFinalPrice(p);
  const badge = p.discountPercent > 0 ? `-${p.discountPercent}%` : undefined;

  return {
    name: p.name,
    brand: p.brand.toUpperCase(),
    price: finalPrice,
    imageUrl: buildImageUrl(p.mainImageFile),
    volume: `${p.volume}ml`,
    badge,
  };
}

const ProductListPage = () => {
  // Get gender from URL params
  const { gender: genderParam } = useParams<{ gender: string }>();
  const [searchParams] = useSearchParams();

  // Get gender config based on URL param (default to 'nam' if not found)
  const genderConfig = useMemo(() => {
    return GENDER_CONFIGS[genderParam ?? "nam"] ?? DEFAULT_GENDER_CONFIG;
  }, [genderParam]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("BEST_SELLING");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  // API integration
  const [allProducts, setAllProducts] = useState<PerfumeDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle URL params for brand and category filters, reset when gender changes
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }
    
    const categoryParam = searchParams.get("category");
    if (categoryParam === "new-arrivals") {
      setCategoryFilter("NEW_ARRIVALS");
    } else if (categoryParam === "best-sellers") {
      setCategoryFilter("BEST_SELLERS");
    } else if (categoryParam === "on-sale") {
      setCategoryFilter("ON_SALE");
    } else {
      setCategoryFilter("ALL");
    }
    
    setPriceFilter("ALL");
  }, [genderParam, searchParams]);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getAllPerfumes();
        setAllProducts(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by current gender
  const genderFilteredProducts = useMemo(() => {
    if (genderConfig.gender === "ALL") return allProducts;
    return allProducts.filter((p) => p.gender === genderConfig.gender);
  }, [allProducts, genderConfig.gender]);

  const allBrands = useMemo(
    () =>
      Array.from(new Set(genderFilteredProducts.map((p) => p.brand))).sort(),
    [genderFilteredProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...genderFilteredProducts];

    // Apply category filter first
    if (categoryFilter === "NEW_ARRIVALS") {
      // Get the latest year from all products
      const latestYear = Math.max(...result.map(p => p.launchYear ?? 0));
      result = result.filter(p => p.launchYear === latestYear);
    } else if (categoryFilter === "BEST_SELLERS") {
      // Filter products with high ratings (4.0+)
      result = result.filter(p => (p.averageRating ?? 0) >= 4.0);
    } else if (categoryFilter === "ON_SALE") {
      // Filter products with discounts
      result = result.filter(p => p.discountPercent > 0);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    result = result.filter((p) => {
      const price = getFinalPrice(p);
      switch (priceFilter) {
        case "UNDER_2M":
          return price < 2_000_000;
        case "FROM_2_TO_4":
          return price >= 2_000_000 && price <= 4_000_000;
        case "FROM_4_TO_6":
          return price > 4_000_000 && price <= 6_000_000;
        case "ABOVE_6":
          return price > 6_000_000;
        default:
          return true;
      }
    });

    result.sort((a, b) => {
      const priceA = getFinalPrice(a);
      const priceB = getFinalPrice(b);

      if (sortBy === "PRICE_ASC") return priceA - priceB;
      if (sortBy === "PRICE_DESC") return priceB - priceA;
      if (sortBy === "NEWEST")
        return (b.launchYear ?? 0) - (a.launchYear ?? 0);

      const ratingA = a.averageRating ?? 0;
      const ratingB = b.averageRating ?? 0;
      if (ratingA !== ratingB) return ratingB - ratingA;
      return priceA - priceB;
    });

    return result;
  }, [genderFilteredProducts, selectedBrands, priceFilter, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const totalCount = filteredProducts.length;

  // Get display title and description based on category filter
  const getPageInfo = () => {
    if (categoryFilter === "NEW_ARRIVALS") {
      return {
        title: "Hàng mới về",
        breadcrumb: "Hàng mới về",
        description: "Những mùi hương vừa cập bến cửa hàng. Khám phá các sản phẩm mới nhất từ các thương hiệu hàng đầu."
      };
    } else if (categoryFilter === "BEST_SELLERS") {
      return {
        title: "Bán chạy nhất",
        breadcrumb: "Bán chạy nhất",
        description: "Top nước hoa được yêu thích nhất. Những mùi hương được đánh giá cao bởi khách hàng."
      };
    } else if (categoryFilter === "ON_SALE") {
      return {
        title: "Đang giảm giá",
        breadcrumb: "Đang giảm giá",
        description: "Ưu đãi hấp dẫn không thể bỏ lỡ. Săn ngay các sản phẩm đang có chương trình khuyến mãi."
      };
    }
    return genderConfig;
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-3 text-xs text-slate-500">
          <Link to="/" className="hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <Link to="/nuoc-hoa/tat-ca" className="hover:text-red-600">
            Nước hoa
          </Link>
          <span className="mx-1">/</span>
          <span className="font-semibold text-slate-800">
            {pageInfo.breadcrumb}
          </span>
        </nav>

        <section className="mb-6 text-sm text-slate-600">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">
            {pageInfo.title}
          </h1>
          <p>{pageInfo.description}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-[260px,1fr]">
          <aside className="space-y-6 border-t border-slate-200 pt-4 text-sm">
            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-900">
                Thương hiệu
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {allBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-slate-300 text-red-600 focus:ring-red-500"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-900">
                Mức giá
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    value="ALL"
                    checked={priceFilter === "ALL"}
                    onChange={() => setPriceFilter("ALL")}
                  />
                  <span>Tất cả</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    value="UNDER_2M"
                    checked={priceFilter === "UNDER_2M"}
                    onChange={() => setPriceFilter("UNDER_2M")}
                  />
                  <span>Dưới 2.000.000₫</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    value="FROM_2_TO_4"
                    checked={priceFilter === "FROM_2_TO_4"}
                    onChange={() => setPriceFilter("FROM_2_TO_4")}
                  />
                  <span>2.000.000₫ - 4.000.000₫</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    value="FROM_4_TO_6"
                    checked={priceFilter === "FROM_4_TO_6"}
                    onChange={() => setPriceFilter("FROM_4_TO_6")}
                  />
                  <span>4.000.000₫ - 6.000.000₫</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    value="ABOVE_6"
                    checked={priceFilter === "ABOVE_6"}
                    onChange={() => setPriceFilter("ABOVE_6")}
                  />
                  <span>Trên 6.000.000₫</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-red-600"></div>
                  <p className="mt-4 text-sm text-slate-500">
                    Đang tải sản phẩm...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {pageInfo.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {totalCount} kết quả
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="hidden sm:inline">Sắp xếp theo:</span>
                    <select
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      <option value="BEST_SELLING">Bán chạy nhất</option>
                      <option value="PRICE_ASC">Giá tăng dần</option>
                      <option value="PRICE_DESC">Giá giảm dần</option>
                      <option value="NEWEST">Mới nhất</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="block">
                      <ProductCard {...mapPerfumeToCardProps(p)} />
                    </Link>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="col-span-full text-sm text-slate-500">
                      Không tìm thấy sản phẩm nào với bộ lọc hiện tại.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductListPage;
