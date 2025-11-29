package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;
import iuh.fit.se.services.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/thongke")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class ThongKeController {
    private final ThongKeService thongKeService;

    @GetMapping("/doanhthu")
    public ApiResponse<List<ThongKeDoanhThuResponse>> thongKeDoanhThu(
            @RequestParam String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer startYear,
            @RequestParam(required = false) Integer endYear
    ) {
        List<ThongKeDoanhThuResponse> data = switch (type.toLowerCase()) {
            case "ngay" -> {
                if (startDate == null || endDate == null) {
                    throw new IllegalArgumentException("startDate và endDate không được để trống");
                }
                yield thongKeService.thongKeDoanhThuTheoNgay(startDate, endDate);
            }
            case "thang" -> {
                if (year == null) {
                    throw new IllegalArgumentException("year không được để trống");
                }
                yield thongKeService.thongKeDoanhThuTheoThang(year);
            }
            case "nam" -> {
                if (startYear == null || endYear == null) {
                    throw new IllegalArgumentException("startYear và endYear không được để trống");
                }
                yield thongKeService.thongKeDoanhThuTheoNam(startYear, endYear);
            }
            default -> throw new IllegalArgumentException("type phải là: ngay, thang, hoặc nam");
        };

        return ApiResponse.<List<ThongKeDoanhThuResponse>>builder()
                .body(data)
                .build();
    }

    @GetMapping("/sanpham/top")
    public ApiResponse<List<TopSanPhamResponse>> topSanPham(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<TopSanPhamResponse>>builder()
                .body(thongKeService.topSanPhamBanChay(limit))
                .build();
    }
}