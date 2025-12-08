package iuh.fit.se.repositories;

import iuh.fit.se.entities.DonHang;
import iuh.fit.se.enums.TrangThaiDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DonHangRepository extends JpaRepository<DonHang, Integer> {

    // Tìm kiếm đơn hàng với các điều kiện tùy chọn
    @Query("SELECT d FROM DonHang d WHERE " +
            "(:trangThai IS NULL OR d.trangThaiDonHang = :trangThai) AND " +
            "(:startDate IS NULL OR d.ngayDat >= :startDate) AND " +
            "(:endDate IS NULL OR d.ngayDat <= :endDate) AND " +
            "(:taiKhoanId IS NULL OR d.taiKhoan.id = :taiKhoanId) " +
            "ORDER BY d.ngayDat DESC")
    List<DonHang> findAllWithFilters(
            @Param("trangThai") TrangThaiDonHang trangThai,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("taiKhoanId") Integer taiKhoanId
    );

    // Thống kê doanh thu theo ngày
    @Query("SELECT d.ngayDat as label, SUM(d.thanhTien) as doanhThu, COUNT(d) as soDonHang " +
            "FROM DonHang d " +
            "WHERE d.trangThaiDonHang = 'DA_GIAO' " +
            "AND d.ngayDat BETWEEN :startDate AND :endDate " +
            "GROUP BY d.ngayDat " +
            "ORDER BY d.ngayDat")
    List<Object[]> thongKeDoanhThuTheoNgay(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    // Thống kê doanh thu theo tháng - SỬA LẠI: Sử dụng Native Query
    @Query(value = "SELECT CONCAT(YEAR(ngayDat), '-', LPAD(MONTH(ngayDat), 2, '0')) as label, " +
            "SUM(thanhTien) as doanhThu, COUNT(*) as soDonHang " +
            "FROM DonHang " +
            "WHERE trangThaiDonHang = 'DA_GIAO' " +
            "AND YEAR(ngayDat) = :year " +
            "GROUP BY YEAR(ngayDat), MONTH(ngayDat) " +
            "ORDER BY MONTH(ngayDat)",
            nativeQuery = true)
    List<Object[]> thongKeDoanhThuTheoThang(@Param("year") int year);

    // Thống kê doanh thu theo năm
    @Query("SELECT YEAR(d.ngayDat) as label, SUM(d.thanhTien) as doanhThu, COUNT(d) as soDonHang " +
            "FROM DonHang d " +
            "WHERE d.trangThaiDonHang = 'DA_GIAO' " +
            "AND YEAR(d.ngayDat) BETWEEN :startYear AND :endYear " +
            "GROUP BY YEAR(d.ngayDat) " +
            "ORDER BY YEAR(d.ngayDat)")
    List<Object[]> thongKeDoanhThuTheoNam(@Param("startYear") int startYear,
                                          @Param("endYear") int endYear);

    // Top sản phẩm bán chạy
    @Query("SELECT n.id, n.tenSanPham, n.hinhAnhChinh, " +
            "SUM(ct.soLuong) as soLuongBan, SUM(ct.tongTien) as doanhThu " +
            "FROM ChiTietDonHang ct " +
            "JOIN ct.nuocHoa n " +
            "JOIN ct.donHang d " +
            "WHERE d.trangThaiDonHang = 'DA_GIAO' " +
            "GROUP BY n.id, n.tenSanPham, n.hinhAnhChinh " +
            "ORDER BY soLuongBan DESC")
    List<Object[]> topSanPhamBanChay(@Param("limit") int limit);

    // Thống kê theo trạng thái đơn hàng
    @Query("SELECT d.trangThaiDonHang as trangThai, COUNT(d) as soDonHang, SUM(d.thanhTien) as tongTien " +
            "FROM DonHang d " +
            "GROUP BY d.trangThaiDonHang " +
            "ORDER BY d.trangThaiDonHang")
    List<Object[]> thongKeTheoTrangThai();

    // Thống kê theo trạng thái trong khoảng thời gian
    @Query("SELECT d.trangThaiDonHang as trangThai, COUNT(d) as soDonHang, SUM(d.thanhTien) as tongTien " +
            "FROM DonHang d " +
            "WHERE d.ngayDat BETWEEN :startDate AND :endDate " +
            "GROUP BY d.trangThaiDonHang " +
            "ORDER BY d.trangThaiDonHang")
    List<Object[]> thongKeTheoTrangThaiTrongKhoang(@Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);
}