package iuh.fit.se.services;

import iuh.fit.se.dtos.requests.donHang.DonHangCreateRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.enums.TrangThaiDonHang;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DonHangService {
    DonHang findByIdRaw(int id);
    DonHangResponse findById(int id);
    List<DonHangResponse> findAll(TrangThaiDonHang trangThai, LocalDate startDate, LocalDate endDate, Integer taiKhoanId);
    DonHangResponse updateTrangThai(DonHangUpdateRequest request);
    void delete(int id);
    DonHang create(DonHang donHang);
    DonHang createFromRequest(DonHangCreateRequest request, String email);
    List<DonHang> findByEmail(String email);
}