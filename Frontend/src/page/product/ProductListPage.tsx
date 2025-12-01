import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard, {
  type ProductCardProps,
} from "../../components/product/ProductCard";
import type { Gender, Perfume } from "../../interface/Product";
import { getFinalPrice } from "../../interface/Product";

// ---- MOCK DATA (sau này thay bằng gọi API Spring Boot) ----

const MOCK_PRODUCTS: Perfume[] = [
  {
    id: 1,
    name: "Dior Sauvage",
    brand: "Dior",
    basePrice: 3_500_000,
    discountPercent: 10,
    mainImageUrl: "/images/dior_sauvage.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDT",
    averageRating: 5.0,
    ratingCount: 2,
  },
  {
    id: 3,
    name: "Versace Eros",
    brand: "Versace",
    basePrice: 2_100_000,
    discountPercent: 15,
    mainImageUrl: "/images/versace_eros.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDT",
    averageRating: 4.5,
    ratingCount: 2,
  },
  {
    id: 7,
    name: "Acqua Di Gio Pour Homme",
    brand: "Giorgio Armani",
    basePrice: 2_500_000,
    discountPercent: 20,
    mainImageUrl: "/images/acqua_gio.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDT",
    averageRating: 4.8,
    ratingCount: 1,
  },
  {
    id: 9,
    name: "Creed Aventus",
    brand: "Creed",
    basePrice: 8_500_000,
    discountPercent: 0,
    mainImageUrl: "/images/creed_aventus.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDP",
    averageRating: 5.0,
    ratingCount: 2,
  },
  {
    id: 12,
    name: "Burberry London",
    brand: "Burberry",
    basePrice: 1_800_000,
    discountPercent: 20,
    mainImageUrl: "/images/burberry_london.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDT",
    averageRating: 3.5,
    ratingCount: 1,
  },
  {
    id: 14,
    name: "Jazz Club",
    brand: "Maison Margiela",
    basePrice: 3_500_000,
    discountPercent: 0,
    mainImageUrl: "/images/jazz_club.jpg",
    volume: 100,
    gender: "MALE",
    type: "EDT",
    averageRating: 5.0,
    ratingCount: 1,
  },
];

// ---- Filter + sort types ----

type SortOption = "BEST_SELLING" | "PRICE_ASC" | "PRICE_DESC" | "NEWEST";

type PriceFilter =
  | "ALL"
  | "UNDER_2M"
  | "FROM_2_TO_4"
  | "FROM_4_TO_6"
  | "ABOVE_6";

const GENDER: Gender = "MALE"; // trang này là "Nước hoa nam"

function mapPerfumeToCardProps(p: Perfume): ProductCardProps {
  const finalPrice = getFinalPrice(p);
  const badge = p.discountPercent > 0 ? `-${p.discountPercent}%` : undefined;

  return {
    name: p.name,
    brand: p.brand.toUpperCase(),
    price: finalPrice,
    imageUrl: p.mainImageUrl,
    volume: `${p.volume}ml`,
    badge,
  };
}

const ProductListPage = () => {
  // state filter
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("BEST_SELLING");

  const allMaleProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.gender === GENDER),
    []
  );

  const allBrands = useMemo(
    () => Array.from(new Set(allMaleProducts.map((p) => p.brand))).sort(),
    [allMaleProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...allMaleProducts];

    // lọc theo brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // lọc theo price
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

    // sort
    result.sort((a, b) => {
      const priceA = getFinalPrice(a);
      const priceB = getFinalPrice(b);

      if (sortBy === "PRICE_ASC") return priceA - priceB;
      if (sortBy === "PRICE_DESC") return priceB - priceA;
      if (sortBy === "NEWEST") return (b.launchYear ?? 0) - (a.launchYear ?? 0);

      // BEST_SELLING: tạm sort theo rating rồi mới theo price
      const ratingA = a.averageRating ?? 0;
      const ratingB = b.averageRating ?? 0;
      if (ratingA !== ratingB) return ratingB - ratingA;
      return priceA - priceB;
    });

    return result;
  }, [allMaleProducts, selectedBrands, priceFilter, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const totalCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* thanh đỏ trên cùng (banner thương hiệu) đã có trong Header rồi */}

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* breadcrumb đơn giản */}
        <nav className="mb-3 text-xs text-slate-500">
          <span className="cursor-pointer hover:text-red-600">Trang chủ</span>
          <span className="mx-1">/</span>
          <span className="cursor-pointer hover:text-red-600">Nước hoa</span>
          <span className="mx-1">/</span>
          <span className="font-semibold text-slate-800">Nước hoa nam</span>
        </nav>

        {/* mô tả category */}
        <section className="mb-6 max-w-3xl text-sm text-slate-600">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">
            Nước hoa nam
          </h1>
          <p>
            Các quý ông đang tìm đến nước hoa để làm gì? Có lẽ là để thơm hơn,
            nam tính và làm chỉn chu thêm phong cách của bản thân. Shop hiểu các
            quý ông của chúng ta: một chai nước hoa cho công việc mỗi ngày, một
            chai cho các buổi hẹn hò hoặc những dịp đặc biệt.
          </p>
        </section>

        {/* layout 2 cột: filter + list */}
        <section className="grid gap-6 md:grid-cols-[260px,1fr]">
          {/* FILTER SIDEBAR */}
          <aside className="space-y-6 border-t border-slate-200 pt-4 text-sm">
            {/* Thương hiệu */}
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

            {/* Mức giá */}
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

            {/* TODO: sau này thêm Size (dungTich), Đánh giá (rating) */}
          </aside>

          {/* MAIN CONTENT: sort + grid */}
          <div className="space-y-4">
            {/* Thanh tiêu đề + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Nước hoa nam
                </h2>
                <p className="text-xs text-slate-500">{totalCount} kết quả</p>
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

            {/* Grid sản phẩm */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} {...mapPerfumeToCardProps(p)} />
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">
                  Không tìm thấy sản phẩm nào với bộ lọc hiện tại.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductListPage;
