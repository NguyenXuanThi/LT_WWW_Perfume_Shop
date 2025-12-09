package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.services.ImageService;
import iuh.fit.se.services.NuocHoaService;
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
    private final NuocHoaService nuocHoaService;

    @PostMapping
    public ApiResponse<String> addImage(@RequestPart("hinhAnhFile") MultipartFile file) throws Exception {
        String hinhAnh = imageService.luuAnh(file);
//        Thread checkTimeout = new Thread(() -> {
//            try {
//                Thread.sleep(11000);
//                if(!nuocHoaService.existsNuocHoaByHinhAnhChinh(hinhAnh) && !nuocHoaService.existsNuocHoaByChiTietNuocHoa_HinhAnhChiTietContaining(hinhAnh))
//                    deleteImage(imageService.splitUrlAndPublicId(id)[1]);
//            } catch (Exception e) {
//                throw new RuntimeException(e);
//            }
//        });
//        checkTimeout.start();
        return ApiResponse.<String>builder().body(hinhAnh).build();
    }

    @DeleteMapping("/delete")
    public ApiResponse<Boolean> deleteImage(@RequestParam String id) throws Exception {
        return ApiResponse.<Boolean>builder()
                .body(imageService.xoaAnh(id))
                .build();
    }
}
