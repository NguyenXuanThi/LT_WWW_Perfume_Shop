import axios from "axios";
import type { PerfumeBase, PerfumeDetail, PerfumeTypeInfo, Gender } from "@/interface/Product";

const BASE_URL = "http://localhost:8080/api";

// ====================== API Types ======================
export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  body: T;
  message: string;
  errors: Record<string, string>;
}

export interface ApiProductDetail {
  nuocHoaId?: number;
  hinhAnhChiTiet: string[];
  xuatXu?: string;
  namPhatHanh?: number;
  nhomHuong?: string;
  phongCachMuiHuong?: string;
  moTa?: string;
}

export interface ApiProduct {
  id: number;
  tenSanPham: string;
  thuongHieu: string;
  giaGoc: number;
  khuyenMai: number;
  hinhAnhChinh?: string;
  dungTich: number;
  doiTuong: Gender;
  chiTietNuocHoa?: ApiProductDetail;
  loaiNuocHoa?: number;
  mucDanhGia?: number;
}

export interface ApiPerfumeType {
  id: number;
  code: string;
  tenLoai?: string;
  nongDoTinhDau?: string;
  doLuuHuong?: string;
  doToaHuong?: string;
}

export interface ProductFilters {
  tenSanPham?: string;
  thuongHieu?: string;
  doiTuong?: Gender;
  loaiNuocHoaId?: number;
  minPrice?: number;
  maxPrice?: number;
}

// ====================== Mappers ======================

/**
 * Build image URL from Cloudinary or local path
 */
export function buildImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return "/images/placeholder-perfume.jpg";
  
  // If it's already a full URL (Cloudinary), return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  // Otherwise, assume it's a local path
  return `/images/${imageUrl}`;
}

/**
 * Map API product to frontend PerfumeBase
 */
export function mapApiToProductBase(api: ApiProduct): PerfumeBase {
  return {
    id: api.id,
    name: api.tenSanPham,
    brand: api.thuongHieu,
    basePrice: api.giaGoc,
    discountPercent: api.khuyenMai ?? 0,
    mainImageFile: api.hinhAnhChinh ?? null,
    volume: api.dungTich,
    gender: api.doiTuong,
    type: {
      id: api.loaiNuocHoa ?? 0,
      code: "EDP", // Default, will be updated if we have perfume type data
    },
  };
}

/**
 * Map API product to frontend PerfumeDetail
 */
export function mapApiToProductDetail(api: ApiProduct): PerfumeDetail {
  const base = mapApiToProductBase(api);
  const detail = api.chiTietNuocHoa;

  return {
    ...base,
    origin: detail?.xuatXu,
    launchYear: detail?.namPhatHanh,
    scentGroup: detail?.nhomHuong,
    style: detail?.phongCachMuiHuong,
    description: detail?.moTa,
    galleryImages: detail?.hinhAnhChiTiet ?? [],
    averageRating: api.mucDanhGia,
  };
}

/**
 * Map API perfume type to frontend PerfumeTypeInfo
 */
export function mapApiToPerfumeType(api: ApiPerfumeType): PerfumeTypeInfo {
  return {
    id: api.id,
    code: api.code as PerfumeTypeInfo["code"],
    description: api.tenLoai,
    oilConcentration: api.nongDoTinhDau,
    longevity: api.doLuuHuong,
    sillage: api.doToaHuong,
  };
}

// ====================== API Calls ======================

/**
 * Get all products with optional filters
 */
export async function getAllProducts(filters?: ProductFilters): Promise<PerfumeDetail[]> {
  const params = new URLSearchParams();
  
  if (filters?.tenSanPham) params.append("tenSanPham", filters.tenSanPham);
  if (filters?.thuongHieu) params.append("thuongHieu", filters.thuongHieu);
  if (filters?.doiTuong) params.append("doiTuong", filters.doiTuong);
  if (filters?.loaiNuocHoaId) params.append("loaiNuocHoaId", String(filters.loaiNuocHoaId));
  if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));

  const url = `${BASE_URL}/public/nuochoa${params.toString() ? `?${params.toString()}` : ""}`;
  
  const response = await axios.get<ApiResponse<ApiProduct[]>>(url);
  
  return response.data.body.map(mapApiToProductDetail);
}

/**
 * Get single product by ID
 */
export async function getProductById(id: number): Promise<PerfumeDetail | null> {
  try {
    const response = await axios.get<ApiResponse<ApiProduct>>(
      `${BASE_URL}/public/nuochoa/${id}`
    );
    return mapApiToProductDetail(response.data.body);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Get all perfume types
 */
export async function getPerfumeTypes(): Promise<PerfumeTypeInfo[]> {
  try {
    const response = await axios.get<ApiResponse<ApiPerfumeType[]>>(
      `${BASE_URL}/admin/loainuochoa`
    );
    return response.data.body.map(mapApiToPerfumeType);
  } catch (error) {
    console.error("Error fetching perfume types:", error);
    return [];
  }
}

/**
 * Search products by keyword
 */
export async function searchProducts(keyword: string): Promise<PerfumeDetail[]> {
  try {
    const response = await axios.get<ApiResponse<ApiProduct[]>>(
      `${BASE_URL}/public/nuochoa/search`,
      { params: { keyword } }
    );
    return response.data.body.map(mapApiToProductDetail);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

/**
 * Get related products based on brand and/or gender
 * Excludes the current product from results
 */
export async function getRelatedProducts(
  currentProductId: number,
  brand: string,
  gender: string,
  limit: number = 6
): Promise<PerfumeDetail[]> {
  try {
    const allProducts = await getAllProducts();
    
    // Filter related products: same brand OR same gender, exclude current product
    const related = allProducts
      .filter(p => p.id !== currentProductId)
      .filter(p => p.brand === brand || p.gender === gender)
      // Prioritize same brand over same gender
      .sort((a, b) => {
        const aScore = (a.brand === brand ? 2 : 0) + (a.gender === gender ? 1 : 0);
        const bScore = (b.brand === brand ? 2 : 0) + (b.gender === gender ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, limit);
    
    return related;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * Get featured products for homepage sections
 */
export async function getFeaturedProducts(): Promise<{
  newArrivals: PerfumeDetail[];
  bestSellers: PerfumeDetail[];
  onSale: PerfumeDetail[];
  forMen: PerfumeDetail[];
  forWomen: PerfumeDetail[];
  unisex: PerfumeDetail[];
}> {
  try {
    const allProducts = await getAllProducts();
    
    // New Arrivals: products with highest launch year
    const newArrivals = [...allProducts]
      .sort((a, b) => (b.launchYear ?? 0) - (a.launchYear ?? 0))
      .slice(0, 6);
    
    // Bestsellers: products with highest rating
    const bestSellers = [...allProducts]
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .slice(0, 6);
    
    // On Sale: products with discount
    const onSale = [...allProducts]
      .filter(p => p.discountPercent > 0)
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 6);
    
    // Gender-specific products
    const forMen = allProducts.filter(p => p.gender === "MALE").slice(0, 6);
    const forWomen = allProducts.filter(p => p.gender === "FEMALE").slice(0, 6);
    const unisex = allProducts.filter(p => p.gender === "UNISEX").slice(0, 6);
    
    return { newArrivals, bestSellers, onSale, forMen, forWomen, unisex };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      newArrivals: [],
      bestSellers: [],
      onSale: [],
      forMen: [],
      forWomen: [],
      unisex: [],
    };
  }
}

/**
 * Convert gender string to URL-friendly format
 */
export function genderToUrlParam(gender: string): string {
  switch (gender.toUpperCase()) {
    case "MALE":
      return "nam";
    case "FEMALE":
      return "nu";
    case "UNISEX":
      return "unisex";
    default:
      return "nam";
  }
}
