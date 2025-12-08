package iuh.fit.se.services;

import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanUpdateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.TaiKhoan;

public interface TaiKhoanService {
    TaiKhoan findByIdRaw(int id);
    TaiKhoan findByEmailRaw(String email);
    TaiKhoanResponse findById(int id);
    TaiKhoanResponse findByEmail(String email);
    boolean register(TaiKhoanCreateRequest request);
    boolean update(TaiKhoanUpdateRequest request);
}
