export type TenVaiTro = "Customer" | "Admin"

export interface User {
    hoTen: string;
    ngaySinh: string;
    soDienThoai: string;
    email: string;
    diaChi: string;
    vaiTro: TenVaiTro;
    active: boolean;
}

export interface NewUser {
    hoTen: string;
    ngaySinh: string;
    soDienThoai: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
    diaChi: string;
}

export interface UserError {
    hoTen: string;
    ngaySinh: string;
    soDienThoai: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
    diaChi: string;
}

export interface UpdateUser {
    hoTen: string;
    ngaySinh: string;
    soDienThoai: string;
    email: string;
    diaChi: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangeVaiTro {
    emailNeedChange: string;
    emailExecute: String;
    vaiTro: TenVaiTro;
}