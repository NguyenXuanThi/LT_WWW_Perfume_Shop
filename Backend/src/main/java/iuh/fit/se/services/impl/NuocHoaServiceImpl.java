package iuh.fit.se.services.impl;

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
import iuh.fit.se.services.LoaiNuocHoaService;
import iuh.fit.se.services.NuocHoaService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final LoaiNuocHoaService loaiNuocHoaService;

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
        Set<ConstraintViolation<NuocHoaCreateRequest>> violations = validator.validate(request);
        factory.close();

        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        // Map NuocHoa
        NuocHoa nuocHoa = nuocHoaMapper.toNuocHoa(request);
//        nuocHoa.setLoaiNuocHoa(loaiNuocHoaService.findByIdRaw(request.getLoaiNuocHoa()));

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
        Set<ConstraintViolation<NuocHoaUpdateRequest>> violations = validator.validate(request);
        factory.close();

        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        // Find existing NuocHoa
        NuocHoa nuocHoa = findByIdRaw(request.getId());

        // Update NuocHoa
        nuocHoaMapper.updateNuocHoa(request, nuocHoa);
//        nuocHoa.setLoaiNuocHoa(loaiNuocHoaService.findByIdRaw(request.getLoaiNuocHoa()));

        // Update ChiTietNuocHoa
        ChiTietNuocHoa chiTietNuocHoa = nuocHoa.getChiTietNuocHoa();
        chiTietNuocHoaMapper.updateChiTietNuocHoa(request.getChiTietNuocHoa(), chiTietNuocHoa);
//        if (chiTietNuocHoa == null) {
//            // Nếu chưa có ChiTietNuocHoa, tạo mới
//            chiTietNuocHoa = chiTietNuocHoaMapper.toChiTietNuocHoa(request.getChiTietNuocHoa());
//            chiTietNuocHoa.setNuocHoaId(nuocHoa.getId());
//            chiTietNuocHoa.setNuocHoa(nuocHoa);
//        } else {
//            // Nếu đã có, update từng field
//            if (request.getChiTietNuocHoa().getHinhAnhChiTiet() != null) {
//                chiTietNuocHoa.setHinhAnhChiTiet(request.getChiTietNuocHoa().getHinhAnhChiTiet());
//            }
//            if (request.getChiTietNuocHoa().getXuatXu() != null) {
//                chiTietNuocHoa.setXuatXu(request.getChiTietNuocHoa().getXuatXu());
//            }
//            if (request.getChiTietNuocHoa().getNamPhatHanh() > 0) {
//                chiTietNuocHoa.setNamPhatHanh(request.getChiTietNuocHoa().getNamPhatHanh());
//            }
//            if (request.getChiTietNuocHoa().getNhomHuong() != null) {
//                chiTietNuocHoa.setNhomHuong(request.getChiTietNuocHoa().getNhomHuong());
//            }
//            if (request.getChiTietNuocHoa().getPhongCachMuiHuong() != null) {
//                chiTietNuocHoa.setPhongCachMuiHuong(request.getChiTietNuocHoa().getPhongCachMuiHuong());
//            }
//            if (request.getChiTietNuocHoa().getMoTa() != null) {
//                chiTietNuocHoa.setMoTa(request.getChiTietNuocHoa().getMoTa());
//            }
//        }

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