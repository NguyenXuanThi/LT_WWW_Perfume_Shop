package iuh.fit.se.services;

import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;

import java.time.LocalDate;
import java.util.List;

public interface ThongKeService {
    List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoNgay(LocalDate startDate, LocalDate endDate);
    List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoThang(int year);
    List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoNam(int startYear, int endYear);
    List<TopSanPhamResponse> topSanPhamBanChay(int limit);
}