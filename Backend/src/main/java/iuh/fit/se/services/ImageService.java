package iuh.fit.se.services;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

public interface ImageService {
    String luuAnh(MultipartFile file) throws IOException;
    boolean xoaAnh(String publicId) throws IOException;
    String[] splitUrlAndPublicId(String combinedString);

    void trackImage(String combinedString);
    Map<String, Long> getPendingImages();
    void removeImageFromTracking(String combinedString);
}