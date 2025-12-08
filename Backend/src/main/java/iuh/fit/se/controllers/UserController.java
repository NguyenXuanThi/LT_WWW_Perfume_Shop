package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanUpdateRequest;
import iuh.fit.se.services.TaiKhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
