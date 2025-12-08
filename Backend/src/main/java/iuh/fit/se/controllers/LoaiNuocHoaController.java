package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.LoaiNuocHoaResponse;
import iuh.fit.se.services.LoaiNuocHoaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/loainuochoa")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class LoaiNuocHoaController {
    private final LoaiNuocHoaService loaiNuocHoaService;

    @GetMapping
    public ApiResponse<List<LoaiNuocHoaResponse>> getAllLoaiNuocHoa() {
        List<LoaiNuocHoaResponse> data = loaiNuocHoaService.findAll();
        return ApiResponse.<List<LoaiNuocHoaResponse>>builder()
                .body(data)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LoaiNuocHoaResponse> getLoaiNuocHoaById(@PathVariable int id) {
        LoaiNuocHoaResponse data = loaiNuocHoaService.findById(id);
        return ApiResponse.<LoaiNuocHoaResponse>builder()
                .body(data)
                .build();
    }

    @PostMapping
    public ApiResponse<LoaiNuocHoaResponse> createLoaiNuocHoa(@Valid @RequestBody LoaiNuocHoaCreateRequest request) {
        LoaiNuocHoaResponse data = loaiNuocHoaService.create(request);
        return ApiResponse.<LoaiNuocHoaResponse>builder()
                .body(data)
                .message("Thêm loại nước hoa thành công")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LoaiNuocHoaResponse> updateLoaiNuocHoa(
            @PathVariable int id,
            @Valid @RequestBody LoaiNuocHoaUpdateRequest request
    ) {
        request.setId(id);
        LoaiNuocHoaResponse data = loaiNuocHoaService.update(request);
        return ApiResponse.<LoaiNuocHoaResponse>builder()
                .body(data)
                .message("Cập nhật loại nước hoa thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteLoaiNuocHoa(@PathVariable int id) {
        loaiNuocHoaService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa loại nước hoa thành công")
                .build();
    }
}