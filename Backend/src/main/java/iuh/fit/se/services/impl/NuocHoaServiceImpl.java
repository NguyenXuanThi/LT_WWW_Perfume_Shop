package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.mappers.NuocHoaMapper;
import iuh.fit.se.repositories.NuocHoaRepository;
import iuh.fit.se.services.NuocHoaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NuocHoaServiceImpl implements NuocHoaService {
    private final NuocHoaRepository nuocHoaRepository;
    private final NuocHoaMapper nuocHoaMapper;

    @Override
    public NuocHoa findByIdRaw(int id) {
        return nuocHoaRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy nước hoa"));
    }

    @Override
    public NuocHoaResponse findById(int id) {
        return nuocHoaMapper.toNuocHoaResponse(findByIdRaw(id));
    }
}
