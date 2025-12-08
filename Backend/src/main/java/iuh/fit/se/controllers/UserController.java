package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanUpdateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.services.TaiKhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final TaiKhoanService taiKhoanService;

    @PostMapping("/update")
    @PreAuthorize("(hasAuthority('Admin')) or (authentication.name == #request.email)")
    public ApiResponse<Boolean> update(@RequestBody TaiKhoanUpdateRequest request) {
        boolean response = taiKhoanService.update(request);
        return ApiResponse.<Boolean>builder()
                .body(response).build();
    }

    @GetMapping("/manage") // Endpoint mới cho quản lý (ví dụ: /api/taikhoan/manage)
    @PreAuthorize("hasAuthority('Admin')") // Ví dụ: Chỉ Admin mới được truy cập
    public ApiResponse<Map<String, Object>> getTaiKhoanPage(
            @RequestParam(defaultValue = "0") int page,
            // Dùng Optional cho các tham số tùy chọn
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean status // true cho Active, false cho Inactive
    ) {
        Page<TaiKhoanResponse> pageResult = taiKhoanService.getTaiKhoanPage(page, search, role, status);

        return ApiResponse.<Map<String, Object>>builder()
                .body(Map.of("content", pageResult.getContent(), "totalPages", pageResult.getTotalPages()))
                .build();
    }

    @GetMapping("/manage/change_active/{email}")
    @PreAuthorize("hasAuthority('Admin')")
    public ApiResponse<Boolean> changeActive(@PathVariable String email, @RequestParam boolean active) {
        return ApiResponse.<Boolean>builder()
                .body(taiKhoanService.changeActive(email, active))
                .build();
    }
}
