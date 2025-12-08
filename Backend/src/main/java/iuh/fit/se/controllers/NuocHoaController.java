package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.enums.DoiTuong;
import iuh.fit.se.services.NuocHoaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/nuochoa")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class NuocHoaController {
    private final NuocHoaService nuocHoaService;

    @GetMapping
    public ApiResponse<List<NuocHoaResponse>> getAllNuocHoa(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String thuongHieu,
            @RequestParam(required = false) DoiTuong doiTuong,
            @RequestParam(required = false) Integer loaiNuocHoaId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<NuocHoaResponse> data = nuocHoaService.findAll(
                tenSanPham, thuongHieu, doiTuong, loaiNuocHoaId, minPrice, maxPrice
        );
        return ApiResponse.<List<NuocHoaResponse>>builder()
                .body(data)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NuocHoaResponse> getNuocHoaById(@PathVariable int id) {
        NuocHoaResponse data = nuocHoaService.findById(id);
        return ApiResponse.<NuocHoaResponse>builder()
                .body(data)
                .build();
    }

    @PostMapping
    public ApiResponse<NuocHoaResponse> createNuocHoa(@Valid @RequestBody NuocHoaCreateRequest request) {
        NuocHoaResponse data = nuocHoaService.create(request);
        return ApiResponse.<NuocHoaResponse>builder()
                .body(data)
                .message("Thêm nước hoa thành công")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<NuocHoaResponse> updateNuocHoa(
            @PathVariable int id,
            @Valid @RequestBody NuocHoaUpdateRequest request
    ) {
        request.setId(id);
        NuocHoaResponse data = nuocHoaService.update(request);
        return ApiResponse.<NuocHoaResponse>builder()
                .body(data)
                .message("Cập nhật nước hoa thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNuocHoa(@PathVariable int id) {
        nuocHoaService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa nước hoa thành công")
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<NuocHoaResponse>> searchNuocHoa(
            @RequestParam String keyword
    ) {
        List<NuocHoaResponse> data = nuocHoaService.search(keyword);
        return ApiResponse.<List<NuocHoaResponse>>builder()
                .body(data)
                .build();
    }
}