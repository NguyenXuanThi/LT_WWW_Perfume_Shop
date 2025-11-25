package iuh.fit.se.services.impl;

import iuh.fit.se.repositories.DanhGiaRepository;
import iuh.fit.se.services.DanhGiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DanhGiaServiceImpl implements DanhGiaService {
    private final DanhGiaRepository danhGiaRepository;

    @Override
    public double avgMucDanhGiaByNuocHoa(int nuocHoa) {
        return danhGiaRepository.avgMucDanhGiaByNuocHoa(nuocHoa);
    }
}
