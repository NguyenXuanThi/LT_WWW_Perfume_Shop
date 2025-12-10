import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard, {
    type ProductCardProps,
} from "../../components/product/ProductCard";

import type { PerfumeDetail } from "../../interface/Product";
import { getFinalPrice, buildImageUrl } from "../../interface/Product";

// MAP GIỚI TÍNH
const genderMap: Record<string, string> = {
    nam: "MALE",
    nu: "FEMALE",
    unisex: "UNISEX",
};

type SortOption = "BEST_SELLING" | "PRICE_ASC" | "PRICE_DESC" | "NEWEST";

type PriceFilter =
    | "ALL"
    | "UNDER_2M"
    | "FROM_2_TO_4"
    | "FROM_4_TO_6"
    | "ABOVE_6";

// API Response Type (Vietnamese field names)
interface ApiNuocHoaResponse {
    id: number;
    tenSanPham: string;
    thuongHieu: string;
    giaGoc: number;
    khuyenMai: number;
    hinhAnhChinh: string;
    dungTich: number;
    doiTuong: string;
    loaiNuocHoa?: number;
    chiTietNuocHoa?: {
        namPhatHanh?: number;
        hinhAnhChiTiet?: string[];
    };
    mucDanhGia?: number;
}

// Map API response to PerfumeDetail
function mapApiToPerfume(api: ApiNuocHoaResponse): PerfumeDetail {
    return {
        id: api.id,
        name: api.tenSanPham,
        brand: api.thuongHieu,
        price: api.giaGoc,
        basePrice: api.giaGoc, // Thêm basePrice
        discountPercent: api.khuyenMai,
        mainImageFile: api.hinhAnhChinh,
        galleryImages: api.chiTietNuocHoa?.hinhAnhChiTiet || [], // Thêm galleryImages
        volume: api.dungTich,
        gender: api.doiTuong,
        type: api.loaiNuocHoa || 1, // Thêm type
        launchYear: api.chiTietNuocHoa?.namPhatHanh,
        averageRating: api.mucDanhGia,
    } as PerfumeDetail;
}

function mapPerfumeToCardProps(p: PerfumeDetail): ProductCardProps {
    const finalPrice = getFinalPrice(p);
    const badge = p.discountPercent > 0 ? `-${p.discountPercent}%` : undefined;

    return {
        name: p.name,
        brand: (p.brand || "").toUpperCase(),
        price: finalPrice,
        imageUrl: buildImageUrl(p.mainImageFile),
        volume: `${p.volume}ml`,
        badge,
    };
}

const ProductListPage = () => {
    const { gender } = useParams();
    const selectedGender = genderMap[gender ?? "nam"];

    const [products, setProducts] = useState<PerfumeDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceFilter, setPriceFilter] = useState<PriceFilter>("ALL");
    const [sortBy, setSortBy] = useState<SortOption>("BEST_SELLING");

    // FETCH API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8080/api/nuochoa?doiTuong=${selectedGender}`
                );
                const data: ApiNuocHoaResponse[] = await res.json();

                // Map API response to PerfumeDetail
                const mappedProducts = data.map(mapApiToPerfume);
                setProducts(mappedProducts);
            } catch (err) {
                console.error("Lỗi tải data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedGender]);

    // -------- THƯƠNG HIỆU ----------
    const allBrands = useMemo(
        () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
        [products]
    );

    // -------- FILTER + SORT ----------
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // lọc brand
        if (selectedBrands.length > 0) {
            result = result.filter((p) => selectedBrands.includes(p.brand));
        }

        // lọc giá
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
            if (sortBy === "NEWEST")
                return (b.launchYear ?? 0) - (a.launchYear ?? 0);

            const ratingA = a.averageRating ?? 0;
            const ratingB = b.averageRating ?? 0;

            if (ratingA !== ratingB) return ratingB - ratingA;
            return priceA - priceB;
        });

        return result;
    }, [products, selectedBrands, priceFilter, sortBy]);

    const handleBrandToggle = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const totalCount = filteredProducts.length;

    // LABEL
    const genderLabel =
        gender === "nu"
            ? "Nước hoa nữ"
            : gender === "unisex"
                ? "Nước hoa unisex"
                : "Nước hoa nam";

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />

            <main className="mx-auto max-w-6xl px-4 py-6">
                {loading ? (
                    <p className="text-center py-10">Đang tải...</p>
                ) : (
                    <>
                        <nav className="mb-3 text-xs text-slate-500">
                            <span className="cursor-pointer hover:text-red-600">Trang chủ</span>
                            <span className="mx-1">/</span>
                            <span className="cursor-pointer hover:text-red-600">Nước hoa</span>
                            <span className="mx-1">/</span>
                            <span className="font-semibold text-slate-800">
                                {genderLabel}
                            </span>
                        </nav>

                        <section className="mb-6 max-w-3xl text-sm text-slate-600">
                            <h1 className="mb-2 text-2xl font-semibold text-slate-900">
                                {genderLabel}
                            </h1>
                            <p>
                                {gender === "nu"
                                    ? "Dành cho các quý cô mong muốn thể hiện sự tinh tế và cuốn hút."
                                    : gender === "unisex"
                                        ? "Những hương thơm phù hợp cho mọi giới, mang phong cách hiện đại."
                                        : "Dành cho các quý ông thể hiện sự nam tính và phong thái lịch lãm."}
                            </p>
                        </section>

                        <section className="grid gap-6 md:grid-cols-[260px,1fr]">
                            {/* SIDEBAR */}
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
                                                    className="h-3 w-3 rounded border-slate-300 text-red-600"
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

                            {/* DANH SÁCH SẢN PHẨM */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {genderLabel}
                                        </h2>
                                        <p className="text-xs text-slate-500">{totalCount} kết quả</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-700">
                                        <span className="hidden sm:inline">Sắp xếp theo:</span>
                                        <select
                                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs"
                                            value={sortBy}
                                            onChange={(e) =>
                                                setSortBy(e.target.value as SortOption)
                                            }
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
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProductListPage;