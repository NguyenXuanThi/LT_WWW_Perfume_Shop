export type Gender = "MALE" | "FEMALE" | "UNISEX";

export type PerfumeTypeCode =
  | "EDP"
  | "EDT"
  | "Parfum"
  | "Cologne"
  | "Eau_Fraiche";

export interface PerfumeTypeInfo {
  id: number;
  code: PerfumeTypeCode;
  description?: string;
  oilConcentration?: string;
  longevity?: string;
  sillage?: string;
}

export interface PerfumeBase {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  discountPercent: number;
  mainImageFile?: string | null;
  volume: number;
  gender: Gender;
  type: number | PerfumeTypeInfo;
}

export interface PerfumeDetail extends PerfumeBase {
  origin?: string;
  launchYear?: number;
  scentGroup?: string;
  style?: string;
  description?: string;

  galleryImages: string[];

  averageRating?: number;
  ratingCount?: number;

  soldCount?: number;

  stock?: number;
}

export function getFinalPrice(p: PerfumeBase): number {
  if (!p.discountPercent) return p.basePrice;
  return Math.round(p.basePrice * (1 - p.discountPercent / 100));
}

export function formatGender(g: Gender): string {
  if (g === "MALE") return "Nam";
  if (g === "FEMALE") return "Nữ";
  return "Unisex";
}

export function buildImageUrl(fileName?: string | null): string {
  if (!fileName) return "/images/placeholder-perfume.jpg";
  
  // If it's already a full URL (Cloudinary), return as-is
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;
  }
  
  // Otherwise, assume it's a local path
  return `/images/${fileName}`;
}

