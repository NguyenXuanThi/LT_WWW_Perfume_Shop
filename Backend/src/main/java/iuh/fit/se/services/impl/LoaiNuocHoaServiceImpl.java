package iuh.fit.se.services.impl;

import iuh.fit.se.entities.LoaiNuocHoa;
import iuh.fit.se.repositories.LoaiNuocHoaRepository;
import iuh.fit.se.services.LoaiNuocHoaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoaiNuocHoaServiceImpl implements LoaiNuocHoaService {
    private final LoaiNuocHoaRepository loaiNuocHoaRepository;

    public LoaiNuocHoa findByIdRaw(int id) {
        return loaiNuocHoaRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy loại nước hoa này"));
    }
}
