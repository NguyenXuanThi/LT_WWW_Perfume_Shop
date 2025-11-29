DROP DATABASE IF EXISTS QuanLyNuocHoa;
CREATE DATABASE IF NOT EXISTS QuanLyNuocHoa;
USE QuanLyNuocHoa;

-- 1. Bảng VaiTro
CREATE TABLE VaiTro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenVaiTro ENUM('Customer', 'Admin') NOT NULL
);

-- 2. Bảng TaiKhoan
CREATE TABLE TaiKhoan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoTen VARCHAR(255) NOT NULL,
    ngaySinh DATE,
    soDienThoai VARCHAR(10) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    diaChi TEXT,
    active BOOLEAN DEFAULT TRUE,
    vaiTroId INT NOT NULL,
    FOREIGN KEY (vaiTroId) REFERENCES VaiTro(id)
);

-- 3. Bảng LoaiNuocHoa
CREATE TABLE LoaiNuocHoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenLoai ENUM('EDP', 'EDT', 'Parfum', 'Cologne', 'Eau_Fraiche') NOT NULL,
    moTa TEXT,
    nongDoTinhDau VARCHAR(100),
    doLuuHuong VARCHAR(100),
    doToaHuong VARCHAR(100)
);

-- 4. Bảng NuocHoa
CREATE TABLE NuocHoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenSanPham VARCHAR(255) NOT NULL,
    thuongHieu VARCHAR(255),
    giaGoc DOUBLE NOT NULL CHECK (giaGoc >= 0), 
    khuyenMai FLOAT DEFAULT 0 CHECK (khuyenMai >= 0 AND khuyenMai <= 100), 
    hinhAnhChinh TEXT,
    dungTich DOUBLE CHECK (dungTich > 0), 
    doiTuong ENUM('MALE', 'FEMALE', 'UNISEX') NOT NULL,
    loaiNuocHoaId INT NOT NULL,
    FOREIGN KEY (loaiNuocHoaId) REFERENCES LoaiNuocHoa(id)
);

-- 5. Bảng ChiTietNuocHoa
CREATE TABLE ChiTietNuocHoa (
    nuocHoaId INT PRIMARY KEY,
    xuatXu VARCHAR(100),
    namPhatHanh INT CHECK (namPhatHanh >= 1900), 
    nhomHuong VARCHAR(255),
    phongCachMuiHuong VARCHAR(255),
    moTa TEXT,
    FOREIGN KEY (nuocHoaId) REFERENCES NuocHoa(id) ON DELETE CASCADE
);

CREATE TABLE HinhAnhNuocHoa (
    nuocHoaId INT NOT NULL,
    urlHinhAnh TEXT NOT NULL,
    FOREIGN KEY (nuocHoaId) REFERENCES NuocHoa(id) ON DELETE CASCADE
);

-- 6. Bảng DonHang
CREATE TABLE DonHang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ngayDat DATE NOT NULL,
    thanhTien DOUBLE NOT NULL CHECK (thanhTien >= 0), 
    phuongThucThanhToan VARCHAR(100),
    diaChiGiaoHang TEXT NOT NULL, 
    soDienThoai VARCHAR(10) NOT NULL,
    ghiChu TEXT,
    trangThaiDonHang ENUM('CHUA_DUOC_GIAO', 'DA_GIAO', 'DA_HUY') DEFAULT 'CHUA_DUOC_GIAO',
    thueVAT DOUBLE,
    phiVanChuyen DOUBLE DEFAULT 30000,
    taiKhoanId INT NOT NULL,
    FOREIGN KEY (taiKhoanId) REFERENCES TaiKhoan(id)
);

-- 7. Bảng ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    donHangId INT NOT NULL,
    nuocHoaId INT NOT NULL,
    soLuong INT NOT NULL CHECK (soLuong > 0), 
    donGia DOUBLE NOT NULL CHECK (donGia >= 0), 
    tongTien DOUBLE NOT NULL CHECK (tongTien >= 0),
    PRIMARY KEY (donHangId, nuocHoaId),
    FOREIGN KEY (donHangId) REFERENCES DonHang(id) ON DELETE CASCADE,
    FOREIGN KEY (nuocHoaId) REFERENCES NuocHoa(id)
);

-- 8. Bảng DanhGia
CREATE TABLE DanhGia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mucDanhGia DOUBLE, 
    taiKhoanId INT NOT NULL,
    nuocHoaId INT NOT NULL,
    UNIQUE (taiKhoanId, nuocHoaId), 
    FOREIGN KEY (taiKhoanId) REFERENCES TaiKhoan(id),
    FOREIGN KEY (nuocHoaId) REFERENCES NuocHoa(id) ON DELETE CASCADE
);

-- 1. VAI TRÒ
INSERT INTO VaiTro (tenVaiTro) VALUES ('Admin'), ('Customer');

-- 2. TÀI KHOẢN (10 Users)
-- Pass chung cho tất cả: 123456
INSERT INTO TaiKhoan (hoTen, ngaySinh, soDienThoai, email, password, diaChi, active, vaiTroId) VALUES 
('Admin System', '1990-01-01', '0999999999', 'admin@shop.com', '$2a$10$M.08VuVbkoI.J8ivenav6OPBxBsF9iDjlPnLVRn9IQUAcdEKwJ/9G', 'Headquarter', TRUE, 1), 
('Manager Kho', '1992-05-05', '0888888888', 'manager@shop.com', '$2a$10$C.47YIuJiptRRHyZKHJy6esSc28NLoQL7F0C9JEC7cIYnPhht0n2W', 'Warehouse', TRUE, 1),
('Nguyen Van A', '1995-02-10', '0901000001', 'user1@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Quan 1, HCM', TRUE, 2),
('Tran Thi B', '1998-08-20', '0901000002', 'user2@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Quan 3, HCM', TRUE, 2),
('Le Van C', '2000-12-12', '0901000003', 'user3@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Quan 5, HCM', TRUE, 2),
('Pham My D', '1999-03-15', '0901000004', 'user4@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Da Nang', TRUE, 2),
('Hoang Van E', '1988-07-07', '0901000005', 'user5@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Ha Noi', TRUE, 2),
('Do Thi F', '2001-01-01', '0901000006', 'user6@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Can Tho', TRUE, 2),
('Vu Van G', '1993-09-09', '0901000007', 'user7@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Hai Phong', TRUE, 2),
('Ngo Thi H', '1997-11-20', '0901000008', 'user8@gmail.com', '$2a$10$0W1luC27eFE6iI9Ln8.7Jus1ylox0CEDXE1yRo/YtoQzk52RhdXMa', 'Nha Trang', TRUE, 2);

-- 3. DANH MỤC
INSERT INTO LoaiNuocHoa (tenLoai, moTa, nongDoTinhDau, doLuuHuong, doToaHuong) VALUES 
('EDP', 'Eau de Parfum', '15-20%', '8-10h', 'Xa'),
('EDT', 'Eau de Toilette', '5-15%', '4-6h', 'Gần'),
('Parfum', 'Pure Perfume', '20-30%', '>12h', 'Rất xa'),
('Cologne', 'Eau de Cologne', '2-4%', '2-3h', 'Rấtquanlynuochoa gần'),
('Eau_Fraiche', 'Mát mẻ', '1-3%', '1-2h', 'Thoang thoảng');

-- 4. SẢN PHẨM (15 Sản phẩm)
INSERT INTO NuocHoa (tenSanPham, thuongHieu, giaGoc, khuyenMai, hinhAnhChinh, dungTich, doiTuong, loaiNuocHoaId) VALUES 
('Dior Sauvage', 'Dior', 3500000, 10, 'dior_sauvage.jpg', 100, 'MALE', 2),          -- ID 1
('Chanel Coco', 'Chanel', 4200000, 0, 'coco_mades.jpg', 50, 'FEMALE', 1),           -- ID 2
('Versace Eros', 'Versace', 2100000, 15, 'versace_eros.jpg', 100, 'MALE', 2),         -- ID 3
('Gucci Bloom', 'Gucci', 3800000, 5, 'gucci_bloom.jpg', 100, 'FEMALE', 1),            -- ID 4
('Santal 33', 'Le Labo', 6500000, 0, 'santal33.jpg', 50, 'UNISEX', 1),                -- ID 5
('Tobacco Vanille', 'Tom Ford', 7200000, 0, 'tf_tobacco.jpg', 50, 'UNISEX', 1),       -- ID 6
('Acqua Di Gio', 'Giorgio Armani', 2500000, 20, 'acqua_gio.jpg', 100, 'MALE', 2),     -- ID 7
('Black Opium', 'YSL', 3900000, 10, 'ysl_black.jpg', 90, 'FEMALE', 1),                -- ID 8
('Creed Aventus', 'Creed', 8500000, 0, 'creed_aventus.jpg', 100, 'MALE', 1),          -- ID 9
('Good Girl', 'Carolina Herrera', 3200000, 10, 'good_girl.jpg', 80, 'FEMALE', 1),     -- ID 10
('Narciso Rodriguez For Her', 'Narciso', 2800000, 5, 'narciso_pink.jpg', 100, 'FEMALE', 1), -- ID 11
('Burberry London', 'Burberry', 1800000, 20, 'burberry_london.jpg', 100, 'MALE', 2),  -- ID 12
('Light Blue', 'Dolce&Gabbana', 2200000, 10, 'light_blue.jpg', 100, 'FEMALE', 2),     -- ID 13
('Jazz Club', 'Maison Margiela', 3500000, 0, 'jazz_club.jpg', 100, 'MALE', 2),        -- ID 14
('English Pear', 'Jo Malone', 3800000, 0, 'jo_malone.jpg', 100, 'FEMALE', 4);         -- ID 15

-- 5. CHI TIẾT SẢN PHẨM & ẢNH
INSERT INTO ChiTietNuocHoa (nuocHoaId, xuatXu, namPhatHanh, nhomHuong, phongCachMuiHuong, moTa) VALUES 
(1, 'France', 2015, 'Aromatic', 'Nam tính', 'Mùi hương quốc dân'),
(2, 'France', 2001, 'Floral', 'Gợi cảm', 'Huyền thoại Chanel'),
(3, 'Italy', 2012, 'Fougere', 'Cuốn hút', 'Thần tình yêu'),
(4, 'Italy', 2017, 'Floral', 'Thanh lịch', 'Vườn hoa'),
(5, 'USA', 2011, 'Woody', 'Cá tính', 'Nước hoa tươi'),
(6, 'USA', 2007, 'Spicy', 'Sang trọng', 'Hương thuốc lá'),
(7, 'Italy', 1996, 'Aquatic', 'Tươi mát', 'Biển cả'),
(8, 'France', 2014, 'Vanilla', 'Bí ẩn', 'Cà phê'),
(9, 'France', 2010, 'Chypre', 'Quyền lực', 'Vua nước hoa'),
(10, 'USA', 2016, 'Floral', 'Quyến rũ', 'Giày gót nhọn'),
(11, 'USA', 2006, 'Musk', 'Nữ tính', 'Xạ hương'),
(12, 'UK', 2006, 'Spicy', 'Lịch lãm', 'Quý ông Anh'),
(13, 'Italy', 2001, 'Citrus', 'Sảng khoái', 'Mùa hè Ý'),
(14, 'France', 2013, 'Leather', 'Ấm áp', 'Câu lạc bộ Jazz'),
(15, 'UK', 2010, 'Fruity', 'Tinh tế', 'Quả lê');

INSERT INTO HinhAnhNuocHoa (nuocHoaId, urlHinhAnh) VALUES 
(1, 'dior_1.jpg'), (1, 'dior_2.jpg'), (2, 'chanel_1.jpg'), (5, 'lelabo_1.jpg');

-- ======================================================================================
-- III. ĐƠN HÀNG (QUAN TRỌNG CHO THỐNG KÊ)
-- Logic: ThanhTien = (TongTienHang + 10% VAT) + 30.000 Ship
-- ======================================================================================

-- ---------------- NĂM 2023 ----------------
-- Tháng 1/2023: Khởi động
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2023-01-15', 3495000, 'DA_GIAO', 315000, 30000, 3, 'HCM', '0901000001'); -- Mua Dior (3.15tr)
INSERT INTO ChiTietDonHang VALUES (1, 1, 1, 3150000, 3150000);

-- Tháng 2/2023: Valentine (Doanh thu cao)
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2023-02-12', 4650000, 'DA_GIAO', 420000, 30000, 4, 'HCM', '0901000002'), -- Chanel (4.2tr)
('2023-02-13', 4001000, 'DA_GIAO', 361000, 30000, 5, 'HCM', '0901000003'), -- Gucci (3.61tr)
('2023-02-14', 1993500, 'DA_GIAO', 178500, 30000, 6, 'DN', '0901000004');  -- Versace (1.785tr)
INSERT INTO ChiTietDonHang VALUES (2, 2, 1, 4200000, 4200000);
INSERT INTO ChiTietDonHang VALUES (3, 4, 1, 3610000, 3610000);
INSERT INTO ChiTietDonHang VALUES (4, 3, 1, 1785000, 1785000);

-- Tháng 5/2023: Đơn bị hủy
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2023-05-20', 7180000, 'DA_HUY', 650000, 30000, 7, 'HN', '0901000005'); -- Le Labo (6.5tr)
INSERT INTO ChiTietDonHang VALUES (5, 5, 1, 6500000, 6500000);

-- Tháng 8/2023
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2023-08-10', 3957000, 'DA_GIAO', 357000, 30000, 8, 'CT', '0901000006'); -- 2 Versace
INSERT INTO ChiTietDonHang VALUES (6, 3, 2, 1785000, 3570000);

-- Tháng 12/2023: Giáng sinh (Siêu to)
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2023-12-20', 10645000, 'DA_GIAO', 965000, 30000, 9, 'HP', '0901000007'), -- Dior + Le Labo
('2023-12-24', 9380000, 'DA_GIAO', 850000, 30000, 10, 'NT', '0901000008'); -- Creed Aventus (8.5tr)
INSERT INTO ChiTietDonHang VALUES (7, 1, 1, 3150000, 3150000), (7, 5, 1, 6500000, 6500000);
INSERT INTO ChiTietDonHang VALUES (8, 9, 1, 8500000, 8500000);

-- ---------------- NĂM 2024 (Rải đều) ----------------

-- Tháng 1/2024: Narciso
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-01-05', 2956000, 'DA_GIAO', 266000, 30000, 3, 'HCM', '0901000001'); 
INSERT INTO ChiTietDonHang VALUES (9, 11, 1, 2660000, 2660000);

-- Tháng 2/2024: Valentine
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-02-14', 4210000, 'DA_GIAO', 380000, 30000, 4, 'HCM', '0901000002'); -- Jo Malone (3.8tr)
INSERT INTO ChiTietDonHang VALUES (10, 15, 1, 3800000, 3800000);

-- Tháng 3/2024: 8/3
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-03-08', 3198000, 'DA_GIAO', 288000, 30000, 5, 'HCM', '0901000003'); -- Good Girl (2.88tr)
INSERT INTO ChiTietDonHang VALUES (11, 10, 1, 2880000, 2880000);

-- Tháng 4/2024: Hủy đơn
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-04-30', 1614000, 'DA_HUY', 144000, 30000, 6, 'DN', '0901000004'); -- Burberry
INSERT INTO ChiTietDonHang VALUES (12, 12, 1, 1440000, 1440000);

-- Tháng 5/2024
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-05-15', 3880000, 'DA_GIAO', 350000, 30000, 7, 'HN', '0901000005'); -- Jazz Club
INSERT INTO ChiTietDonHang VALUES (13, 14, 1, 3500000, 3500000);

-- Tháng 6/2024: Mua sỉ (3 chai Light Blue)
-- Light Blue (2.2tr giảm 10% = 1.98tr). 3 chai = 5.94tr
-- VAT = 594k. Tong = 6.564.000
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-06-20', 6564000, 'DA_GIAO', 594000, 30000, 8, 'CT', '0901000006');
INSERT INTO ChiTietDonHang VALUES (14, 13, 3, 1980000, 5940000);

-- Tháng 7/2024
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-07-07', 4749000, 'DA_GIAO', 429000, 30000, 9, 'HP', '0901000007'); -- Black Opium (3.9tr)
INSERT INTO ChiTietDonHang VALUES (15, 8, 1, 4290000, 4290000); -- (Giả sử giá lúc này tăng hoặc ko KM)

-- Tháng 8/2024
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-08-08', 2780000, 'DA_GIAO', 250000, 30000, 10, 'NT', '0901000008'); -- Acqua Di Gio
INSERT INTO ChiTietDonHang VALUES (16, 7, 1, 2500000, 2500000);

-- Tháng 9/2024
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-09-02', 8720000, 'DA_GIAO', 790000, 30000, 3, 'HCM', '0901000001'); -- Tom Ford (7.9tr)
INSERT INTO ChiTietDonHang VALUES (17, 6, 1, 7900000, 7900000);

-- Tháng 10/2024: 20/10
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-10-18', 4650000, 'DA_GIAO', 420000, 30000, 4, 'HCM', '0901000002'); -- Chanel
INSERT INTO ChiTietDonHang VALUES (18, 2, 1, 4200000, 4200000);

-- Tháng 11/2024: Đơn mới đặt (Chưa giao)
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-11-20', 3495000, 'CHUA_DUOC_GIAO', 315000, 30000, 5, 'HCM', '0901000003'); -- Dior
INSERT INTO ChiTietDonHang VALUES (19, 1, 1, 3150000, 3150000);

-- Tháng 12/2024: Đơn mới đặt (Chưa giao) - Mua nhiều
INSERT INTO DonHang (ngayDat, thanhTien, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId, diaChiGiaoHang, soDienThoai) VALUES 
('2024-12-05', 14330000, 'CHUA_DUOC_GIAO', 1300000, 30000, 6, 'DN', '0901000004'); -- 2 Le Labo
INSERT INTO ChiTietDonHang VALUES (20, 5, 2, 6500000, 13000000);

-- ======================================================================================
-- IV. ĐÁNH GIÁ (REVIEWS)
-- ======================================================================================
INSERT INTO DanhGia (mucDanhGia, taiKhoanId, nuocHoaId) VALUES 
(5.0, 3, 1), (4.5, 4, 2), (5.0, 5, 4), (4.0, 6, 3), (3.5, 7, 5),
(5.0, 8, 3), (5.0, 9, 1), (5.0, 10, 9), (4.5, 3, 11), (5.0, 4, 15),
(4.0, 5, 10), (3.0, 6, 12), (5.0, 7, 14), (4.5, 8, 13), (5.0, 9, 6);