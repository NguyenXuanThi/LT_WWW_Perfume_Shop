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
    soDienThoai VARCHAR(20) UNIQUE, 
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
    tenLoai ENUM('EDP', 'EDT', 'Parfum', 'Cologne', 'Eau Fraiche') NOT NULL,
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
    soDienThoai VARCHAR(20) NOT NULL,
    ghiChu TEXT,
    trangThaiDonHang ENUM('CHUA_DUOC_GIAO', 'DA_GIAO', 'DA_HUY') DEFAULT 'CHUA_DUOC_GIAO',
    thueVAT DOUBLE DEFAULT 0.1,
    phiVanChuyen DOUBLE DEFAULT 0,
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
    mucDanhGia INT, 
    taiKhoanId INT NOT NULL,
    nuocHoaId INT NOT NULL,
    UNIQUE (taiKhoanId, nuocHoaId), 
    FOREIGN KEY (taiKhoanId) REFERENCES TaiKhoan(id),
    FOREIGN KEY (nuocHoaId) REFERENCES NuocHoa(id) ON DELETE CASCADE
);

-- =============================================
-- 1. INSERT VAI TRÒ
-- =============================================
INSERT INTO VaiTro (tenVaiTro) VALUES 
('Admin'), 
('Customer');

-- =============================================
-- 2. INSERT TÀI KHOẢN (2 Admin, 5 Khách)
-- =============================================
INSERT INTO TaiKhoan (hoTen, ngaySinh, soDienThoai, email, password, diaChi, active, vaiTroId) VALUES 
('Admin System', '1990-01-01', '0999999999', 'admin@shop.com', 'admin123', 'Server Room', TRUE, 1),
('Quan Ly Kho', '1992-02-02', '0888888888', 'manager@shop.com', 'manager123', 'Kho Hang', TRUE, 1),
('Nguyen Van A', '1995-05-10', '0901111111', 'nguyenvana@gmail.com', '123456', '123 Le Loi, Quan 1, HCM', TRUE, 2),
('Tran Thi B', '1998-08-20', '0902222222', 'tranthib@gmail.com', '123456', '456 Nguyen Hue, Quan 1, HCM', TRUE, 2),
('Le Van C', '2000-12-12', '0903333333', 'levanc@yahoo.com', '123456', '789 Vo Van Kiet, Quan 5, HCM', TRUE, 2),
('Pham My D', '1999-03-15', '0904444444', 'phammyd@outlook.com', '123456', 'Da Nang City', TRUE, 2),
('Hoang Van E', '1988-07-07', '0905555555', 'hoangvane@gmail.com', '123456', 'Hanoi Capital', FALSE, 2); -- Acc này bị khóa

-- =============================================
-- 3. INSERT LOẠI NƯỚC HOA
-- =============================================
INSERT INTO LoaiNuocHoa (tenLoai, moTa, nongDoTinhDau, doLuuHuong, doToaHuong) VALUES 
('EDP', 'Eau de Parfum - Đậm đặc, sang trọng', '15-20%', '8-10 giờ', 'Xa (2m)'),
('EDT', 'Eau de Toilette - Nhẹ nhàng, công sở', '5-15%', '4-6 giờ', 'Gần (1 cánh tay)'),
('Parfum', 'Pure Perfume - Tinh dầu nguyên chất', '20-30%', 'Trên 12 giờ', 'Rất xa'),
('Cologne', 'Eau de Cologne - Mát mẻ, thể thao', '2-4%', '2-3 giờ', 'Rất gần'),
('Eau Fraiche', 'Loãng nhất, dùng xịt body', '1-3%', '1-2 giờ', 'Thoang thoảng');

-- =============================================
-- 4. INSERT NƯỚC HOA (10 Sản phẩm HOT)
-- Lưu ý thứ tự ID sẽ từ 1 đến 10
-- =============================================
INSERT INTO NuocHoa (tenSanPham, thuongHieu, giaGoc, khuyenMai, hinhAnhChinh, dungTich, doiTuong, loaiNuocHoaId) VALUES 
('Dior Sauvage', 'Dior', 3500000, 10, 'dior_sauvage.jpg', 100, 'MALE', 2),         -- ID 1
('Chanel Coco Mademoiselle', 'Chanel', 4200000, 0, 'coco_mades.jpg', 50, 'FEMALE', 1), -- ID 2
('Versace Eros', 'Versace', 2100000, 15, 'versace_eros.jpg', 100, 'MALE', 2),         -- ID 3
('Gucci Bloom', 'Gucci', 3800000, 5, 'gucci_bloom.jpg', 100, 'FEMALE', 1),            -- ID 4
('Le Labo Santal 33', 'Le Labo', 6500000, 0, 'santal33.jpg', 50, 'UNISEX', 1),        -- ID 5
('Tom Ford Tobacco Vanille', 'Tom Ford', 7200000, 0, 'tf_tobacco.jpg', 50, 'UNISEX', 1),-- ID 6
('Acqua Di Gio', 'Giorgio Armani', 2500000, 20, 'acqua_gio.jpg', 100, 'MALE', 2),     -- ID 7
('YSL Black Opium', 'Yves Saint Laurent', 3900000, 10, 'ysl_black.jpg', 90, 'FEMALE', 1), -- ID 8
('Creed Aventus', 'Creed', 8500000, 0, 'creed_aventus.jpg', 100, 'MALE', 1),          -- ID 9
('Kilian Good Girl Gone Bad', 'Kilian', 6800000, 5, 'kilian_goodgirl.jpg', 50, 'FEMALE', 1); -- ID 10

-- =============================================
-- 5. INSERT CHI TIẾT NƯỚC HOA (Mapping 1-1 với ID ở trên)
-- =============================================
INSERT INTO ChiTietNuocHoa (nuocHoaId, xuatXu, namPhatHanh, nhomHuong, phongCachMuiHuong, moTa) VALUES 
(1, 'France', 2015, 'Aromatic Fougere', 'Nam tính, Mạnh mẽ, Phóng khoáng', 'Mùi hương quốc dân dành cho nam giới.'),
(2, 'France', 2001, 'Oriental Floral', 'Gợi cảm, Sang trọng, Quý phái', 'Biểu tượng của sự nữ tính hiện đại.'),
(3, 'Italy', 2012, 'Aromatic Fougere', 'Cuốn hút, Nam tính, Tươi mát', 'Lấy cảm hứng từ thần tình yêu Eros.'),
(4, 'Italy', 2017, 'Floral', 'Thanh lịch, Tinh tế, Dịu dàng', 'Như một khu vườn đầy hoa huệ và hoa nhài.'),
(5, 'USA', 2011, 'Woody Aromatic', 'Cá tính, Độc đáo, Gỗ đàn hương', 'Mùi hương "nước hoa tươi" nổi tiếng nhất của Le Labo.'),
(6, 'USA', 2007, 'Oriental Spicy', 'Ấm áp, Ngọt ngào, Sang chảnh', 'Hương thuốc lá pha vanilla cực kỳ đẳng cấp.'),
(7, 'Italy', 1996, 'Aromatic Aquatic', 'Tươi mát, Biển cả, Sảng khoái', 'Huyền thoại mùa hè không thể thiếu.'),
(8, 'France', 2014, 'Oriental Vanilla', 'Bí ẩn, Năng động, Thu hút', 'Hương cà phê đen và hoa trắng gây nghiện.'),
(9, 'France', 2010, 'Chypre Fruity', 'Quyền lực, Thành đạt, Vương giả', 'Vua của các loại nước hoa nam.'),
(10, 'France', 2012, 'Floral Fruity', 'Gợi cảm, Táo bạo, Khiêu khích', 'Gái hư luôn có sức hút khó cưỡng.');

-- =============================================
-- 6. INSERT HÌNH ẢNH PHỤ (Mỗi SP có 2-3 ảnh)
-- =============================================
INSERT INTO HinhAnhNuocHoa (nuocHoaId, urlHinhAnh) VALUES 
(1, 'dior_sauvage_side.jpg'), (1, 'dior_sauvage_box.jpg'),
(2, 'coco_zoom.jpg'), (2, 'coco_lifestyle.jpg'),
(3, 'eros_blue.jpg'), (3, 'eros_bottle.jpg'),
(4, 'gucci_flower.jpg'),
(5, 'santal33_lab.jpg'), (5, 'santal33_hand.jpg'),
(9, 'creed_box.jpg'), (9, 'creed_cap.jpg'), (9, 'creed_fake_check.jpg');

-- =============================================
-- 7. INSERT ĐƠN HÀNG (Giả lập các trạng thái)
-- =============================================
INSERT INTO DonHang (ngayDat, thanhTien, phuongThucThanhToan, diaChiGiaoHang, soDienThoai, ghiChu, trangThaiDonHang, thueVAT, phiVanChuyen, taiKhoanId) VALUES 
('2023-10-01', 3150000, 'CASH', 'Nha A, HCM', '0901111111', 'Giao sang', 'DA_GIAO', 315000, 30000, 3), -- User 3 mua Dior
('2023-10-05', 4200000, 'BANKING', 'Nha B, HCM', '0902222222', 'Giao chieu', 'DA_GIAO', 420000, 0, 4),    -- User 4 mua Chanel
('2023-10-20', 13000000, 'VISA', 'Nha C, HCM', '0903333333', 'Tang qua sn', 'CHUA_DUOC_GIAO', 1300000, 50000, 5), -- User 5 mua Le Labo x2
('2023-11-01', 2100000, 'CASH', 'Nha D, Da Nang', '0904444444', '', 'DA_HUY', 210000, 40000, 6),       -- User 6 huy don
('2023-11-02', 8500000, 'BANKING', 'Nha A, HCM', '0901111111', 'Can gap', 'CHUA_DUOC_GIAO', 850000, 0, 3); -- User 3 mua them Creed

-- =============================================
-- 8. INSERT CHI TIẾT ĐƠN HÀNG (Mapping DonHang - NuocHoa)
-- =============================================
INSERT INTO ChiTietDonHang (donHangId, nuocHoaId, soLuong, donGia, tongTien) VALUES 
(1, 1, 1, 3150000, 3150000), -- Đơn 1 mua 1 Dior (đã giảm giá)
(2, 2, 1, 4200000, 4200000), -- Đơn 2 mua 1 Chanel
(3, 5, 2, 6500000, 13000000),-- Đơn 3 mua 2 Le Labo
(4, 3, 1, 2100000, 2100000), -- Đơn 4 mua 1 Versace
(5, 9, 1, 8500000, 8500000); -- Đơn 5 mua 1 Creed

-- =============================================
-- 9. INSERT ĐÁNH GIÁ
-- =============================================
INSERT INTO DanhGia (mucDanhGia, taiKhoanId, nuocHoaId) VALUES 
(5, 3, 1), -- User 3 khen Dior
(4, 4, 2), -- User 4 khen Chanel
(5, 5, 5), -- User 5 khen Le Labo
(3, 6, 3), -- User 6 che Versace (vừa phải)
(5, 3, 9); -- User 3 khen Creed
