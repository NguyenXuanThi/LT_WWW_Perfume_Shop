export interface Category {
  id: number;
  tenLoai: string;
  moTa: string;
  nongDoTinhDau: string;
  doLuuHuong: string;
  doToaHuong: string;
}

export interface CategoryCreate {
  tenLoai: string;
  moTa: string;
  nongDoTinhDau: string;
  doLuuHuong: string;
  doToaHuong: string;
}
