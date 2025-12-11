package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.taiKhoan.ChangeVaiTroRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanUpdateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.enums.TenVaiTro;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaiKhoanServiceImpl implements TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final TaiKhoanMapper taiKhoanMapper;
    private final PasswordEncoder passwordEncoder;
    private final VaiTroService vaiTroService;
    private final int pageSize = 10;

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
        return taiKhoanMapper.toTaiKhoanResponse(findByIdRaw(id));
    }

    @Override
    public TaiKhoanResponse findByEmail(String email) {
        return taiKhoanMapper.toTaiKhoanResponse(findByEmailRaw(email));
    }

    @Override
    public boolean register(TaiKhoanCreateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<TaiKhoanCreateRequest>> violations = validator.validate(request);
        boolean matchPassword = Objects.equals(request.getNewPassword(), request.getConfirmPassword());
        if (!violations.isEmpty() || !matchPassword) {
            throw new PostException(violations, (!matchPassword)? Map.of("confirmPassword", "password xác nhận không trùng khớp"): null);
        }

        TaiKhoan taiKhoan = taiKhoanMapper.toTaiKhoan(request);
        taiKhoan.setVaiTro(vaiTroService.findByIdRaw(2));
        taiKhoan.setPassword(passwordEncoder.encode(taiKhoan.getPassword()));
        taiKhoanRepository.save(taiKhoan);

        return true;
    }

    public boolean update(TaiKhoanUpdateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<TaiKhoanUpdateRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }

        TaiKhoan taiKhoan = findByEmailRaw(request.getEmail());
        if (!Objects.equals(request.getConfirmPassword(), request.getNewPassword()))
            throw new AppException(ErrorCode.CONFIRM_PASSWORD_DOES_NOT_MATCH);
        if (!passwordEncoder.matches(request.getCurrentPassword(), taiKhoan.getPassword()))
            throw new AppException(ErrorCode.CURRENT_PASSWORD_DOES_NOT_MATCH);
        taiKhoanMapper.updateTaiKhoan(request, taiKhoan);
        taiKhoan.setPassword(passwordEncoder.encode(request.getNewPassword()));
        taiKhoanRepository.save(taiKhoan);
        return true;
    }

    @Override
    public Page<TaiKhoanResponse> getTaiKhoanPage(int page, String searchKey, String roleName, Boolean status) {
        int pageSize = 10;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("id").descending());

        String finalSearchKey = (searchKey != null && !searchKey.isEmpty()) ? searchKey : null;
        TenVaiTro finalRoleName = (roleName != null && !roleName.isEmpty()) ? TenVaiTro.valueOf(roleName) : null;
        Page<TaiKhoan> taiKhoanPage = taiKhoanRepository.searchAndFilterTaiKhoan(
                finalSearchKey,
                finalRoleName,
                status,
                pageable
        );

        return taiKhoanPage.map(taiKhoanMapper::toTaiKhoanResponse);
    }

    public boolean changeActive(String email, boolean active) {
        TaiKhoan taiKhoan = findByEmailRaw(email);

        if (taiKhoan.getVaiTro().getTenVaiTro() == TenVaiTro.Admin) {
            throw new AppException(ErrorCode.CAN_NOT_CHANGE_ACTIVE_ADMIN);
        }

        taiKhoan.setActive(active);
        taiKhoanRepository.save(taiKhoan);
        return true;
    }

    @Override
    public boolean changeVaiTro(ChangeVaiTroRequest request) {
        TaiKhoan taiKhoan = findByEmailRaw(request.getEmailNeedChange());
        if (!Objects.equals(request.getEmailExecute(), "admin@shop.com")) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        taiKhoan.setVaiTro(vaiTroService.findByTenVaiTroRaw(request.getVaiTro()));
        taiKhoanRepository.save(taiKhoan);
        return true;
    }
}
