package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaUpdateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.entities.ChiTietNuocHoa;
import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.enums.DoiTuong;
import iuh.fit.se.exceptions.PostException;
import iuh.fit.se.mappers.ChiTietNuocHoaMapper;
import iuh.fit.se.mappers.NuocHoaMapper;
import iuh.fit.se.repositories.ChiTietNuocHoaRepository;
import iuh.fit.se.repositories.NuocHoaRepository;
import iuh.fit.se.services.NuocHoaService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NuocHoaServiceImpl implements NuocHoaService {
    private final NuocHoaRepository nuocHoaRepository;
    private final ChiTietNuocHoaRepository chiTietNuocHoaRepository;
    private final NuocHoaMapper nuocHoaMapper;
    private final ChiTietNuocHoaMapper chiTietNuocHoaMapper;

    @Override
    public NuocHoa findByIdRaw(int id) {
        return nuocHoaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nước hoa với id: " + id));
    }

    @Override
    public NuocHoaResponse findById(int id) {
        return nuocHoaMapper.toNuocHoaResponse(findByIdRaw(id));
    }

    @Override
    public List<NuocHoaResponse> findAll(String tenSanPham, String thuongHieu, DoiTuong doiTuong,
                                         Integer loaiNuocHoaId, Double minPrice, Double maxPrice) {
        List<NuocHoa> nuocHoas = nuocHoaRepository.findAllWithFilters(
                tenSanPham, thuongHieu, doiTuong, loaiNuocHoaId, minPrice, maxPrice
        );

        return nuocHoas.stream()
                .map(nuocHoaMapper::toNuocHoaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NuocHoaResponse create(NuocHoaCreateRequest request) {
        // Validate request
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        // Validate NuocHoa (Cha)
        Set<ConstraintViolation<NuocHoaCreateRequest>> violations = validator.validate(request);

        // Validate ChiTietNuocHoa (Con) - NEW
        Set<ConstraintViolation<ChiTietNuocHoaCreateRequest>> chiTietViolations = validator.validate(request.getChiTietNuocHoa());

        factory.close();

        // Kiểm tra lỗi ở cả cha và con
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
        if (!chiTietViolations.isEmpty()) {
            throw new PostException(chiTietViolations);
        }

        // Map NuocHoa (Mapper tự xử lý LoaiNuocHoa)
        NuocHoa nuocHoa = nuocHoaMapper.toNuocHoa(request);

        // Map & Link ChiTietNuocHoa
        ChiTietNuocHoa chiTietNuocHoa = chiTietNuocHoaMapper.toChiTietNuocHoa(request.getChiTietNuocHoa());
        chiTietNuocHoa.setNuocHoa(nuocHoa);
        nuocHoa.setChiTietNuocHoa(chiTietNuocHoa);

        nuocHoa = nuocHoaRepository.save(nuocHoa);

        return nuocHoaMapper.toNuocHoaResponse(nuocHoa);
    }

    @Override
    @Transactional
    public NuocHoaResponse update(NuocHoaUpdateRequest request) {
        // Validate request
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        // Validate NuocHoa (Cha)
        Set<ConstraintViolation<NuocHoaUpdateRequest>> violations = validator.validate(request);

        // Validate ChiTietNuocHoa (Con) - NEW
        Set<ConstraintViolation<ChiTietNuocHoaUpdateRequest>> chiTietViolations = validator.validate(request.getChiTietNuocHoa());

        factory.close();

        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
        if (!chiTietViolations.isEmpty()) {
            throw new PostException(chiTietViolations);
        }

        // Find existing NuocHoa
        NuocHoa nuocHoa = findByIdRaw(request.getId());

        // Update NuocHoa (Mapper tự xử lý LoaiNuocHoa)
        nuocHoaMapper.updateNuocHoa(request, nuocHoa);

        // Update ChiTietNuocHoa
        ChiTietNuocHoa chiTietNuocHoa = nuocHoa.getChiTietNuocHoa();

        // Nếu data cũ không có chi tiết, tạo mới để tránh NullPointerException
        if (chiTietNuocHoa == null) {
            // Logic tạo mới nếu cần, hoặc map từ request sang object mới
            // Ở đây giả sử update thì đã có chi tiết rồi hoặc mapper xử lý
            // Nếu cần thiết có thể gán: chiTietNuocHoa = new ChiTietNuocHoa(); nuocHoa.setChiTietNuocHoa(chiTietNuocHoa);
        }

        chiTietNuocHoaMapper.updateChiTietNuocHoa(request.getChiTietNuocHoa(), chiTietNuocHoa);

        // Save (Cascade ALL sẽ lo phần chi tiết, nhưng save rõ ràng cũng tốt)
        chiTietNuocHoaRepository.save(chiTietNuocHoa);
        nuocHoa = nuocHoaRepository.save(nuocHoa);

        return nuocHoaMapper.toNuocHoaResponse(nuocHoa);
    }

    @Override
    @Transactional
    public void delete(int id) {
        NuocHoa nuocHoa = findByIdRaw(id);

        // Kiểm tra xem có đơn hàng nào đang sử dụng sản phẩm này không
        if (nuocHoa.getChiTietDonHangs() != null && !nuocHoa.getChiTietDonHangs().isEmpty()) {
            throw new RuntimeException("Không thể xóa nước hoa đã có trong đơn hàng");
        }

        nuocHoaRepository.deleteById(id);
    }

    @Override
    public List<NuocHoaResponse> search(String keyword) {
        List<NuocHoa> nuocHoas = nuocHoaRepository.searchByKeyword(keyword);

        return nuocHoas.stream()
                .map(nuocHoaMapper::toNuocHoaResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsNuocHoaByHinhAnhChinh(String hinhAnhChinh) {
        return nuocHoaRepository.existsNuocHoaByHinhAnhChinh(hinhAnhChinh);
    }

    @Override
    public boolean existsNuocHoaByChiTietNuocHoa_HinhAnhChiTietContaining(String urlHinhAnh) {
        return nuocHoaRepository.existsNuocHoaByChiTietNuocHoa_HinhAnhChiTietContaining(urlHinhAnh);
    }
}