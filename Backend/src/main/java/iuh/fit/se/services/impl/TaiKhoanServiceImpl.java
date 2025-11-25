package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.mappers.TaiKhoanMapper;
import iuh.fit.se.repositories.TaiKhoanRepository;
import iuh.fit.se.services.TaiKhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaiKhoanServiceImpl implements TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final TaiKhoanMapper taiKhoanMapper;

    @Override
    public TaiKhoan findByIdRaw(int id) {
        return taiKhoanRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
    }

    @Override
    public TaiKhoan findByEmailRaw(String email) {
        List<TaiKhoan> taiKhoans = taiKhoanRepository.findByEmail(email);
        if (taiKhoans.isEmpty()) throw new RuntimeException("Không tìm thấy tài khoản");
        return taiKhoans.getFirst();
    }

    @Override
    public TaiKhoanResponse findById(int id) {
        return taiKhoanMapper.toTaiKhoanRespone(findByIdRaw(id));
    }

    @Override
    public TaiKhoanResponse findByEmail(String email) {
        return taiKhoanMapper.toTaiKhoanRespone(findByEmailRaw(email));
    }
}
