package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.ThongKeTrangThaiDonHangResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.repositories.DonHangRepository;
import iuh.fit.se.services.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongKeServiceImpl implements ThongKeService {
    private final DonHangRepository donHangRepository;

    @Override
    public List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoNgay(LocalDate startDate, LocalDate endDate) {
        return donHangRepository.thongKeDoanhThuTheoNgay(startDate, endDate)
                .stream()
                .map(row -> ThongKeDoanhThuResponse.builder()
                        .label(row[0].toString())
                        .doanhThu((Double) row[1])
                        .soDonHang((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoThang(int year) {
        return donHangRepository.thongKeDoanhThuTheoThang(year)
                .stream()
                .map(row -> ThongKeDoanhThuResponse.builder()
                        .label("Tháng " + row[0])
                        .doanhThu((Double) row[1])
                        .soDonHang((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ThongKeDoanhThuResponse> thongKeDoanhThuTheoNam(int startYear, int endYear) {
        return donHangRepository.thongKeDoanhThuTheoNam(startYear, endYear)
                .stream()
                .map(row -> ThongKeDoanhThuResponse.builder()
                        .label("Năm " + row[0])
                        .doanhThu((Double) row[1])
                        .soDonHang((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<TopSanPhamResponse> topSanPhamBanChay(int limit) {
        return donHangRepository.topSanPhamBanChay(limit)
                .stream()
                .limit(limit)
                .map(row -> TopSanPhamResponse.builder()
                        .sanPhamId((Integer) row[0])
                        .tenSanPham((String) row[1])
                        .hinhAnh((String) row[2])
                        .soLuongBan((Long) row[3])
                        .doanhThu((Double) row[4])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ThongKeTrangThaiDonHangResponse> thongKeTheoTrangThai() {
        return donHangRepository.thongKeTheoTrangThai()
                .stream()
                .map(row -> ThongKeTrangThaiDonHangResponse.builder()
                        .trangThai((TrangThaiDonHang) row[0])
                        .soDonHang((Long) row[1])
                        .tongTien((Double) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ThongKeTrangThaiDonHangResponse> thongKeTheoTrangThaiTrongKhoang(LocalDate startDate, LocalDate endDate) {
        return donHangRepository.thongKeTheoTrangThaiTrongKhoang(startDate, endDate)
                .stream()
                .map(row -> ThongKeTrangThaiDonHangResponse.builder()
                        .trangThai((TrangThaiDonHang) row[0])
                        .soDonHang((Long) row[1])
                        .tongTien((Double) row[2])
                        .build())
                .collect(Collectors.toList());
    }
}