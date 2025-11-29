package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.exceptions.PostException;
import iuh.fit.se.mappers.TaiKhoanMapper;
import iuh.fit.se.repositories.TaiKhoanRepository;
import iuh.fit.se.services.TaiKhoanService;
import iuh.fit.se.services.VaiTroService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaiKhoanServiceImpl implements TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final TaiKhoanMapper taiKhoanMapper;
    private final PasswordEncoder passwordEncoder;
    private final VaiTroService vaiTroService;

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

    @Override
    public TaiKhoanResponse register(TaiKhoanCreateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<TaiKhoanCreateRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        TaiKhoan taiKhoan = taiKhoanMapper.toTaiKhoan(request);
        taiKhoan.setVaiTro(vaiTroService.findByIdRaw(2));
        taiKhoan.setPassword(passwordEncoder.encode(taiKhoan.getPassword()));
        taiKhoan = taiKhoanRepository.save(taiKhoan);

        return taiKhoanMapper.toTaiKhoanRespone(taiKhoan);
    }
}
