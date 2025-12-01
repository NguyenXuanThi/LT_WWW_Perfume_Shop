export type Gender = "MALE" | "FEMALE" | "UNISEX";

export type PerfumeType = "EDP" | "EDT" | "Parfum" | "Cologne" | "Eau_Fraiche";

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  discountPercent: number;
  mainImageUrl: string;
  volume: number;
  gender: Gender;
  type: PerfumeType;

  // Dữ liệu mở rộng từ ChiTietNuocHoa + DanhGia (có thể null)
  origin?: string;
  launchYear?: number;
  scentGroup?: string;
  style?: string;
  description?: string;
  averageRating?: number;
  ratingCount?: number;
}

// helper tính giá sau giảm
export function getFinalPrice(p: Perfume): number {
  if (!p.discountPercent) return p.basePrice;
  return Math.round(p.basePrice * (1 - p.discountPercent / 100));
}
