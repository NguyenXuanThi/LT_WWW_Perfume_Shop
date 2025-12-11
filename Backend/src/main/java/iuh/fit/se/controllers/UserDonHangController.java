package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/donhang")
@RequiredArgsConstructor
public class UserDonHangController {

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

    // TẠO ĐƠN HÀNG (USER)
    @PostMapping
    public DonHang createDonHang(@RequestBody DonHang donHang) {
        donHang.setTrangThaiDonHang(TrangThaiDonHang.CHUA_DUOC_GIAO);
        return donHangService.create(donHang);
    }

    // XÓA ĐƠN HÀNG (CHỈ KHI CHƯA ĐƯỢC GIAO)
    @DeleteMapping("/{id}")
    public String deleteDonHang(@PathVariable int id) {
        DonHang dh = donHangService.findByIdRaw(id);

        if (dh == null) {
            return "Không tìm thấy đơn hàng";
        }

        if (dh.getTrangThaiDonHang() != TrangThaiDonHang.CHUA_DUOC_GIAO) {
            return "Không thể xóa đơn hàng vì đã được giao hoặc đã hủy";
        }

        donHangService.delete(id);
        return "Xóa đơn hàng thành công";
    }
}
