package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.services.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('Admin')")
public class ImageController {
    private final ImageService imageService;

    @PostMapping
    public ApiResponse<String> addImage(@RequestPart("hinhAnhFile") MultipartFile file) throws Exception {
        // Upload ảnh, hàm này đã tự động gọi trackImage() bên trong Service rồi
        String hinhAnh = imageService.luuAnh(file);

        // Trả về ngay lập tức, không cần Thread chờ đợi gì cả
        return ApiResponse.<String>builder().body(hinhAnh).build();
    }

    @DeleteMapping("/delete")
    public ApiResponse<Boolean> deleteImage(@RequestParam String id) throws Exception {
        return ApiResponse.<Boolean>builder()
                .body(imageService.xoaAnh(id))
                .build();
    }
}