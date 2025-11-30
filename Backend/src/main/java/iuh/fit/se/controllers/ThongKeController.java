package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.ThongKeTrangThaiDonHangResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;
import iuh.fit.se.services.ExcelExportService;
import iuh.fit.se.services.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/admin/thongke")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class ThongKeController {
    private final ThongKeService thongKeService;
    private final ExcelExportService excelExportService;

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

    @GetMapping("/doanhthu/export")
    public ResponseEntity<byte[]> exportDoanhThu(
            @RequestParam String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer startYear,
            @RequestParam(required = false) Integer endYear
    ) throws IOException {
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

        byte[] excelFile = excelExportService.exportDoanhThu(data, type);

        String fileName = String.format("ThongKeDoanhThu_%s_%s.xlsx",
                type,
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelFile);
    }

    @GetMapping("/sanpham/top")
    public ApiResponse<List<TopSanPhamResponse>> topSanPham(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<TopSanPhamResponse>>builder()
                .body(thongKeService.topSanPhamBanChay(limit))
                .build();
    }

    @GetMapping("/sanpham/top/export")
    public ResponseEntity<byte[]> exportTopSanPham(
            @RequestParam(defaultValue = "10") int limit
    ) throws IOException {
        List<TopSanPhamResponse> data = thongKeService.topSanPhamBanChay(limit);
        byte[] excelFile = excelExportService.exportTopSanPham(data, limit);

        String fileName = String.format("TopSanPham_%s.xlsx",
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelFile);
    }
    @GetMapping("/trangthai")
    public ApiResponse<List<ThongKeTrangThaiDonHangResponse>> thongKeTrangThai(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<ThongKeTrangThaiDonHangResponse> data;

        if (startDate != null && endDate != null) {
            data = thongKeService.thongKeTheoTrangThaiTrongKhoang(startDate, endDate);
        } else {
            data = thongKeService.thongKeTheoTrangThai();
        }

        return ApiResponse.<List<ThongKeTrangThaiDonHangResponse>>builder()
                .body(data)
                .build();
    }

    @GetMapping("/trangthai/export")
    public ResponseEntity<byte[]> exportThongKeTrangThai(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {
        List<ThongKeTrangThaiDonHangResponse> data;

        if (startDate != null && endDate != null) {
            data = thongKeService.thongKeTheoTrangThaiTrongKhoang(startDate, endDate);
        } else {
            data = thongKeService.thongKeTheoTrangThai();
        }

        byte[] excelFile = excelExportService.exportThongKeTrangThai(data);

        String fileName = String.format("ThongKeTrangThai_%s.xlsx",
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelFile);
    }
}