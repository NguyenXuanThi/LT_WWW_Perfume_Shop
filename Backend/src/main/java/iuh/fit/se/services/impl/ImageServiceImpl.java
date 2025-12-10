package iuh.fit.se.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.services.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final Cloudinary cloudinary;
    private final String SEPARATOR = "?";

    // Sử dụng ConcurrentHashMap để an toàn khi nhiều người cùng upload
    // Key: Chuỗi ảnh (URL?PublicId), Value: Thời gian upload (Timestamp)
    private final Map<String, Long> pendingImages = new ConcurrentHashMap<>();

    @Override
    public String luuAnh(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String uniqueID = java.util.UUID.randomUUID().toString();
        String newFileName = uniqueID + fileExtension;

        Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "folder", "nuoc_hoa_project",
                "public_id", newFileName,
                "resource_type", "auto"
        );

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            String secureUrl = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            String result = secureUrl + SEPARATOR + publicId;

            // LƯU Ý: Sau khi upload thành công, đưa ngay vào danh sách theo dõi
            trackImage(result);

            return result;
        } catch (IOException e) {
            throw new IOException("Tải ảnh lên Cloudinary thất bại: " + e.getMessage());
        }
    }

    @Override
    public boolean xoaAnh(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        return true;
    }

    @Override
    public String[] splitUrlAndPublicId(String combinedString) {
        if (combinedString == null || !combinedString.contains(SEPARATOR)) {
            throw new IllegalArgumentException("Định dạng chuỗi hình ảnh không hợp lệ.");
        }
        String[] parts = combinedString.split("\\?", 2); // Regex split ? cần \\
        if (parts.length != 2) {
            throw new IllegalArgumentException("Không tìm thấy đủ 2 phần tử.");
        }
        parts[0] = parts[0].trim();
        parts[1] = parts[1].trim();
        return parts;
    }

    @Override
    public void trackImage(String combinedString) {
        // Lưu thời gian hiện tại
        pendingImages.put(combinedString, System.currentTimeMillis());
    }

    @Override
    public Map<String, Long> getPendingImages() {
        return pendingImages;
    }

    @Override
    public void removeImageFromTracking(String combinedString) {
        pendingImages.remove(combinedString);
    }
}