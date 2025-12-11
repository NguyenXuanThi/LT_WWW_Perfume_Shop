package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.donHang.DonHangCreateRequest;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donhang")
@RequiredArgsConstructor
public class UserDonHangController {

    private final DonHangService donHangService;

    @GetMapping("/me")
    public ApiResponse<List<DonHang>> getMyOrders(Authentication authentication) {

        String email = authentication.getName();

        List<DonHang> orders = donHangService.findByEmail(email);

        return ApiResponse.<List<DonHang>>builder()
                .body(orders)
                .message("Lấy danh sách đơn hàng thành công")
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
    public ApiResponse<DonHang> createDonHang(
            @RequestBody DonHangCreateRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        DonHang donHang = donHangService.createFromRequest(request, email);
        return ApiResponse.<DonHang>builder()
                .body(donHang)
                .message("Đặt hàng thành công")
                .build();
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
