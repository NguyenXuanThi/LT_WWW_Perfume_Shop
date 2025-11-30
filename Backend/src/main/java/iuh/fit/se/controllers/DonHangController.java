package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/donhang")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class DonHangController {
    private final DonHangService donHangService;

    @GetMapping
    public ApiResponse<List<DonHangResponse>> getAllDonHang(
            @RequestParam(required = false) TrangThaiDonHang trangThai,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer taiKhoanId
    ) {
        List<DonHangResponse> data = donHangService.findAll(trangThai, startDate, endDate, taiKhoanId);
        return ApiResponse.<List<DonHangResponse>>builder()
                .body(data)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DonHangResponse> getDonHangById(@PathVariable int id) {
        DonHangResponse data = donHangService.findById(id);
        return ApiResponse.<DonHangResponse>builder()
                .body(data)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DonHangResponse> updateDonHang(
            @PathVariable int id,
            @RequestBody DonHangUpdateRequest request
    ) {
        request.setId(id);
        DonHangResponse data = donHangService.updateTrangThai(request);
        return ApiResponse.<DonHangResponse>builder()
                .body(data)
                .message("Cập nhật đơn hàng thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDonHang(@PathVariable int id) {
        donHangService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa đơn hàng thành công")
                .build();
    }
}