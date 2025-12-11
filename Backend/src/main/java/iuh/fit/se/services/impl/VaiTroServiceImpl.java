package iuh.fit.se.services.impl;

import iuh.fit.se.entities.VaiTro;
import iuh.fit.se.enums.TenVaiTro;
import iuh.fit.se.repositories.VaiTroRepository;
import iuh.fit.se.services.VaiTroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VaiTroServiceImpl implements VaiTroService {
    private final VaiTroRepository vaiTroRepository;

    @Override
    public VaiTro findByIdRaw(int id) {
        return vaiTroRepository.findById(2).orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò"));
    }

    @Override
    public VaiTro findByTenVaiTroRaw(String tenVaiTro) {
        return vaiTroRepository.findByTenVaiTro(TenVaiTro.valueOf(tenVaiTro)).getFirst();
    }
}
