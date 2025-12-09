package iuh.fit.se.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.services.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final Cloudinary cloudinary;
    private final String SEPARATOR = "?";

    @Override
    public String luuAnh(MultipartFile file) throws IOException {
        // 1. Lấy phần mở rộng (extension) của file gốc
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 2. Tạo tên file duy nhất (UUID) và kết hợp với extension
        String uniqueID = java.util.UUID.randomUUID().toString();
        String newFileName = uniqueID + fileExtension;

        // 3. Sử dụng tên file mới làm Public ID trong Cloudinary
        Map<String, Object> uploadOptions = com.cloudinary.utils.ObjectUtils.asMap(
                "folder", "nuoc_hoa_project",
                "public_id", newFileName, // 👈 Đặt Public ID là tên file mới
                "resource_type", "auto"
        );

        try {
            // ... (phần code tải lên)
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            String secureUrl = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            return secureUrl + SEPARATOR + publicId;
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
            // Xử lý lỗi hoặc trả về mảng rỗng/null
            throw new IllegalArgumentException("Định dạng chuỗi hình ảnh không hợp lệ.");
        }

        // Chỉ tách chuỗi tại vị trí của SEPARATOR đầu tiên
        // Giới hạn = 2 đảm bảo chỉ tách thành 2 phần
        String[] parts = combinedString.split(SEPARATOR, 2);

        if (parts.length != 2) {
            throw new IllegalArgumentException("Không tìm thấy đủ 2 phần tử (URL và Public ID).");
        }

        // Trim để loại bỏ khoảng trắng dư thừa
        parts[0] = parts[0].trim();
        parts[1] = parts[1].trim();

        return parts;
    }
}
