package iuh.fit.se.services.impl;

import iuh.fit.se.entities.DonHang;
import iuh.fit.se.repositories.DonHangRepository;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonHangServiceImpl implements DonHangService {
    private final DonHangRepository donHangRepository;

    @Override
    public DonHang findByIdRaw(int id) {
        return donHangRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }
}
