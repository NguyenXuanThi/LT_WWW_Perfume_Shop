-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for perfumeentitiesanddto
CREATE DATABASE IF NOT EXISTS `perfumeentitiesanddto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `perfumeentitiesanddto`;

-- Dumping structure for table perfumeentitiesanddto.chitietdonhang
CREATE TABLE IF NOT EXISTS `chitietdonhang` (
  `donGia` double NOT NULL CHECK (`donGia` >= 0),
  `donHangId` int(11) NOT NULL,
  `nuocHoaId` int(11) NOT NULL,
  `soLuong` int(11) NOT NULL CHECK (`soLuong` > 0),
  `tongTien` double NOT NULL CHECK (`tongTien` >= 0),
  PRIMARY KEY (`donHangId`,`nuocHoaId`),
  KEY `FKa0epp2ay7w07okpq4t9jt0746` (`nuocHoaId`),
  CONSTRAINT `FK8qrywajyimelh7s8jc6ci2wa4` FOREIGN KEY (`donHangId`) REFERENCES `donhang` (`id`),
  CONSTRAINT `FKa0epp2ay7w07okpq4t9jt0746` FOREIGN KEY (`nuocHoaId`) REFERENCES `nuochoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.chitietdonhang: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.chitietnuochoa
CREATE TABLE IF NOT EXISTS `chitietnuochoa` (
  `namPhatHanh` int(11) DEFAULT NULL CHECK (`namPhatHanh` >= 1900),
  `nuocHoa_id` int(11) NOT NULL,
  `xuatXu` varchar(100) DEFAULT NULL,
  `moTa` text DEFAULT NULL,
  `nhomHuong` varchar(255) DEFAULT NULL,
  `phongCachMuiHuong` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nuocHoa_id`),
  CONSTRAINT `FKgewyhwcw9elck556mp9juw5bi` FOREIGN KEY (`nuocHoa_id`) REFERENCES `nuochoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.chitietnuochoa: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.danhgia
CREATE TABLE IF NOT EXISTS `danhgia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mucDanhGia` int(11) NOT NULL,
  `nuocHoaId` int(11) NOT NULL,
  `taiKhoanId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmcya4aurw8xypcd42x10twq8k` (`taiKhoanId`,`nuocHoaId`),
  KEY `FKgeiitw0sb837wfwgtc0ydo2t6` (`nuocHoaId`),
  CONSTRAINT `FKfesswo7ydyo9yl1p224mfvtdu` FOREIGN KEY (`taiKhoanId`) REFERENCES `taikhoan` (`id`),
  CONSTRAINT `FKgeiitw0sb837wfwgtc0ydo2t6` FOREIGN KEY (`nuocHoaId`) REFERENCES `nuochoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.danhgia: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.donhang
CREATE TABLE IF NOT EXISTS `donhang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngayDat` date NOT NULL,
  `phiVanChuyen` double DEFAULT 0,
  `taiKhoanId` int(11) DEFAULT NULL,
  `thanhTien` double NOT NULL CHECK (`thanhTien` >= 0),
  `thueVAT` double DEFAULT 0.1,
  `diaChiGiaoHang` text NOT NULL,
  `ghiChu` text DEFAULT NULL,
  `phuongThucThanhToan` varchar(255) DEFAULT NULL,
  `soDienThoai` varchar(255) NOT NULL,
  `trangThaiDonHang` enum('CHUA_DUOC_GIAO','DA_GIAO','DA_HUY') DEFAULT 'CHUA_DUOC_GIAO',
  PRIMARY KEY (`id`),
  KEY `FKtk2k3eq73a6mnmrqdftium7se` (`taiKhoanId`),
  CONSTRAINT `FKtk2k3eq73a6mnmrqdftium7se` FOREIGN KEY (`taiKhoanId`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.donhang: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.hinhanhnuochoa
CREATE TABLE IF NOT EXISTS `hinhanhnuochoa` (
  `nuocHoaId` int(11) NOT NULL,
  `urlHinhAnh` text NOT NULL,
  KEY `FKbxybj2jptu5ke9owb1tweub8u` (`nuocHoaId`),
  CONSTRAINT `FKbxybj2jptu5ke9owb1tweub8u` FOREIGN KEY (`nuocHoaId`) REFERENCES `chitietnuochoa` (`nuocHoa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.hinhanhnuochoa: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.loainuochoa
CREATE TABLE IF NOT EXISTS `loainuochoa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doLuuHuong` varchar(255) DEFAULT NULL,
  `doToaHuong` varchar(255) DEFAULT NULL,
  `moTa` text DEFAULT NULL,
  `nongDoTinhDau` varchar(255) DEFAULT NULL,
  `tenLoai` enum('Colonge','EDP','EDT','Eau_Fraiche','Parfum') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.loainuochoa: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.nuochoa
CREATE TABLE IF NOT EXISTS `nuochoa` (
  `dungTich` double DEFAULT NULL CHECK (`dungTich` > 0),
  `giaGoc` double NOT NULL CHECK (`giaGoc` >= 0),
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `khuyenMai` float DEFAULT 0 CHECK (`khuyenMai` >= 0 and `khuyenMai` <= 100),
  `loaiNuocHoa_id` int(11) DEFAULT NULL,
  `hinhAnhChinh` text DEFAULT NULL,
  `tenSanPham` varchar(255) NOT NULL,
  `thuongHieu` varchar(255) DEFAULT NULL,
  `doiTuong` enum('FEMALE','MALE','UNISEX') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqmld1i4hkhd60bh4v79r5gor7` (`loaiNuocHoa_id`),
  CONSTRAINT `FKqmld1i4hkhd60bh4v79r5gor7` FOREIGN KEY (`loaiNuocHoa_id`) REFERENCES `loainuochoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.nuochoa: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.taikhoan
CREATE TABLE IF NOT EXISTS `taikhoan` (
  `active` tinyint(1) DEFAULT 1,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngaySinh` date DEFAULT NULL,
  `vaiTroId` int(11) DEFAULT NULL,
  `diaChi` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `hoTen` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `soDienThoai` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7sa1jv1ommxnkmeapkxkdtiil` (`email`),
  KEY `FK2arcqv3m34994n6k20bpt7w29` (`vaiTroId`),
  CONSTRAINT `FK2arcqv3m34994n6k20bpt7w29` FOREIGN KEY (`vaiTroId`) REFERENCES `vaitro` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.taikhoan: ~0 rows (approximately)

-- Dumping structure for table perfumeentitiesanddto.vaitro
CREATE TABLE IF NOT EXISTS `vaitro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenVaiTro` enum('Admin','Customer') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table perfumeentitiesanddto.vaitro: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
