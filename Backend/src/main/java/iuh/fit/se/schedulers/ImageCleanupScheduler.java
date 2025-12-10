package iuh.fit.se.schedulers;

import iuh.fit.se.services.ImageService;
import iuh.fit.se.services.NuocHoaService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ImageCleanupScheduler {
    private final ImageService imageService;
    private final NuocHoaService nuocHoaService;

    // Chạy mỗi 1 phút (60.000 ms) một lần
    @Scheduled(fixedRate = 60000)
    public void cleanUpOrphanImages() {
        long now = System.currentTimeMillis();
        // Thời gian chờ cho phép: 5 phút (300.000 ms)
        // Nếu upload quá 5 phút mà chưa lưu -> Xóa
        long timeout = 300000;

        System.out.println("Running Image Cleanup Task...");

        // Duyệt qua danh sách các ảnh đang chờ
        for (Map.Entry<String, Long> entry : imageService.getPendingImages().entrySet()) {
            String imageString = entry.getKey();
            Long uploadTime = entry.getValue();

            // Chỉ kiểm tra những ảnh đã upload quá 5 phút
            if (now - uploadTime > timeout) {
                try {
                    // 1. Kiểm tra trong Database
                    boolean usedInNuocHoa = nuocHoaService.existsNuocHoaByHinhAnhChinh(imageString);
                    boolean usedInChiTiet = nuocHoaService.existsNuocHoaByChiTietNuocHoa_HinhAnhChiTietContaining(imageString);

                    if (usedInNuocHoa || usedInChiTiet) {
                        // Ảnh ĐÃ ĐƯỢC LƯU -> Chỉ cần xóa khỏi danh sách theo dõi
                        imageService.removeImageFromTracking(imageString);
                    } else {
                        // Ảnh RÁC (Không ai lưu) -> Xóa trên Cloudinary
                        System.out.println("Deleting orphan image: " + imageString);
                        String publicId = imageService.splitUrlAndPublicId(imageString)[1];
                        imageService.xoaAnh(publicId);

                        // Xóa xong thì bỏ theo dõi
                        imageService.removeImageFromTracking(imageString);
                    }
                } catch (Exception e) {
                    System.err.println("Lỗi khi dọn dẹp ảnh: " + imageString + " - " + e.getMessage());
                }
            }
        }
    }
}