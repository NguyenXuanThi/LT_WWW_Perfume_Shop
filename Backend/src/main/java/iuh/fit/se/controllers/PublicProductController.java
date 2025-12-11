package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.enums.DoiTuong;
import iuh.fit.se.services.NuocHoaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public API Controller for product viewing (no authentication required)
 */
@RestController
@RequestMapping("/public/nuochoa")
@RequiredArgsConstructor
public class PublicProductController {
        private final NuocHoaService nuocHoaService;

        /**
         * Get all products with optional filters
         */
        @GetMapping
        public ApiResponse<List<NuocHoaResponse>> getAllNuocHoa(
                        @RequestParam(required = false) String tenSanPham,
                        @RequestParam(required = false) String thuongHieu,
                        @RequestParam(required = false) DoiTuong doiTuong,
                        @RequestParam(required = false) Integer loaiNuocHoaId,
                        @RequestParam(required = false) Double minPrice,
                        @RequestParam(required = false) Double maxPrice) {
                List<NuocHoaResponse> data = nuocHoaService.findAll(
                                tenSanPham, thuongHieu, doiTuong, loaiNuocHoaId, minPrice, maxPrice);
                return ApiResponse.<List<NuocHoaResponse>>builder()
                                .body(data)
                                .build();
        }

        /**
         * Get product by ID
         */
        @GetMapping("/{id}")
        public ApiResponse<NuocHoaResponse> getNuocHoaById(@PathVariable int id) {
                NuocHoaResponse data = nuocHoaService.findById(id);
                return ApiResponse.<NuocHoaResponse>builder()
                                .body(data)
                                .build();
        }

        /**
         * Search products by keyword
         */
        @GetMapping("/search")
        public ApiResponse<List<NuocHoaResponse>> searchNuocHoa(
                        @RequestParam String keyword) {
                List<NuocHoaResponse> data = nuocHoaService.search(keyword);
                return ApiResponse.<List<NuocHoaResponse>>builder()
                                .body(data)
                                .build();
        }

        /**
         * Get all unique brands
         */
        @GetMapping("/thuonghieu")
        public ApiResponse<List<String>> getAllBrands() {
                List<String> data = nuocHoaService.getAllBrands();
                return ApiResponse.<List<String>>builder()
                                .body(data)
                                .build();
        }
}
