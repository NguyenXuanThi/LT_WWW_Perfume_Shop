package iuh.fit.se.services.impl;

import iuh.fit.se.entities.ChiTietNuocHoa;
import iuh.fit.se.repositories.ChiTietNuocHoaRepository;
import iuh.fit.se.services.ChiTietNuocHoaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChiTietNuocHoaServiceImpl implements ChiTietNuocHoaService {
    private final ChiTietNuocHoaRepository chiTietNuocHoaRepository;

    @Override
    public ChiTietNuocHoa findById(int id) {
        return chiTietNuocHoaRepository.findById(1).orElseThrow(() -> new RuntimeException("id: " + id + " not found!"));
    }
}
