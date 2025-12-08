package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.LoaiNuocHoaResponse;
import iuh.fit.se.entities.LoaiNuocHoa;
import iuh.fit.se.exceptions.PostException;
import iuh.fit.se.mappers.LoaiNuocHoaMapper;
import iuh.fit.se.repositories.LoaiNuocHoaRepository;
import iuh.fit.se.services.LoaiNuocHoaService;
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
public class LoaiNuocHoaServiceImpl implements LoaiNuocHoaService {
    private final LoaiNuocHoaRepository loaiNuocHoaRepository;
    private final LoaiNuocHoaMapper loaiNuocHoaMapper;

    @Override
    public LoaiNuocHoa findByIdRaw(int id) {
        return loaiNuocHoaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại nước hoa với id: " + id));
    }

    @Override
    public LoaiNuocHoaResponse findById(int id) {
        return loaiNuocHoaMapper.toLoaiNuocHoaResponse(findByIdRaw(id));
    }

    @Override
    public List<LoaiNuocHoaResponse> findAll() {
        return loaiNuocHoaRepository.findAll()
                .stream()
                .map(loaiNuocHoaMapper::toLoaiNuocHoaResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public LoaiNuocHoaResponse create(LoaiNuocHoaCreateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<LoaiNuocHoaCreateRequest>> violations = validator.validate(request);
        factory.close();

        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        LoaiNuocHoa loaiNuocHoa = loaiNuocHoaMapper.toLoaiNuocHoa(request);
        loaiNuocHoa = loaiNuocHoaRepository.save(loaiNuocHoa);

        return loaiNuocHoaMapper.toLoaiNuocHoaResponse(loaiNuocHoa);
    }

    @Transactional
    @Override
    public LoaiNuocHoaResponse update(LoaiNuocHoaUpdateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<LoaiNuocHoaUpdateRequest>> violations = validator.validate(request);
        factory.close();

        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        LoaiNuocHoa loaiNuocHoa = findByIdRaw(request.getId());
        loaiNuocHoaMapper.updateLoaiNuocHoa(request, loaiNuocHoa);
        loaiNuocHoa = loaiNuocHoaRepository.save(loaiNuocHoa);

        return loaiNuocHoaMapper.toLoaiNuocHoaResponse(loaiNuocHoa);
    }

    @Transactional
    @Override
    public void delete(int id) {
        LoaiNuocHoa loaiNuocHoa = findByIdRaw(id);

        // Kiểm tra xem có nước hoa nào đang sử dụng loại này không
        if (loaiNuocHoa.getNuocHoas() != null && !loaiNuocHoa.getNuocHoas().isEmpty()) {
            throw new RuntimeException("Không thể xóa loại nước hoa đang được sử dụng");
        }

        loaiNuocHoaRepository.deleteById(id);
    }
}