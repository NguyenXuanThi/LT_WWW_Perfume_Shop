package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.chiTietDonHang.ChiTietDonHangRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangCreateRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.responses.ChiTietDonHangResponse;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.ChiTietDonHang;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.mappers.ChiTietDonHangMapper;
import iuh.fit.se.mappers.DonHangMapper;
import iuh.fit.se.repositories.DonHangRepository;
import iuh.fit.se.repositories.NuocHoaRepository;
import iuh.fit.se.repositories.TaiKhoanRepository;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static iuh.fit.se.enums.TrangThaiDonHang.CHUA_DUOC_GIAO;

@Service
@RequiredArgsConstructor
public class DonHangServiceImpl implements DonHangService {
    private final DonHangRepository donHangRepository;
    private final DonHangMapper donHangMapper;
    private final ChiTietDonHangMapper chiTietDonHangMapper;
    private final TaiKhoanRepository taiKhoanRepository;
    private final NuocHoaRepository nuocHoaRepository;

    @Override
    public DonHang findByIdRaw(int id) {
        return donHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với id: " + id));
    }

    @Override
    public DonHangResponse findById(int id) {
        DonHang donHang = findByIdRaw(id);
        DonHangResponse response = donHangMapper.toDonHangResponse(donHang);

        // Map chi tiết đơn hàng
        Set<ChiTietDonHang> chiTietDonHangs = donHang.getChiTietDonHangs();
        if (chiTietDonHangs != null) {
            List<ChiTietDonHangResponse> chiTietResponses = chiTietDonHangs.stream()
                    .map(chiTietDonHangMapper::toChiTietDonHangResponse)
                    .collect(Collectors.toList());
            response.setChiTietDonHangs(chiTietResponses);
        }

        return response;
    }

    @Override
    public List<DonHangResponse> findAll(TrangThaiDonHang trangThai, LocalDate startDate, LocalDate endDate, Integer taiKhoanId) {
        List<DonHang> donHangs = donHangRepository.findAllWithFilters(trangThai, startDate, endDate, taiKhoanId);

        return donHangs.stream()
                .map(donHang -> {
                    DonHangResponse response = donHangMapper.toDonHangResponse(donHang);

                    // Map chi tiết đơn hàng
                    Set<ChiTietDonHang> chiTietDonHangs = donHang.getChiTietDonHangs();
                    if (chiTietDonHangs != null) {
                        List<ChiTietDonHangResponse> chiTietResponses = chiTietDonHangs.stream()
                                .map(chiTietDonHangMapper::toChiTietDonHangResponse)
                                .collect(Collectors.toList());
                        response.setChiTietDonHangs(chiTietResponses);
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DonHangResponse updateTrangThai(DonHangUpdateRequest request) {
        DonHang donHang = findByIdRaw(request.getId());

        // Kiểm tra logic nghiệp vụ
        if (donHang.getTrangThaiDonHang() == TrangThaiDonHang.DA_GIAO) {
            throw new RuntimeException("Không thể thay đổi trạng thái của đơn hàng đã giao");
        }

        if (donHang.getTrangThaiDonHang() == TrangThaiDonHang.DA_HUY) {
            throw new RuntimeException("Không thể thay đổi trạng thái của đơn hàng đã hủy");
        }

        donHangMapper.updateDonHang(request, donHang);
        donHang = donHangRepository.save(donHang);

        DonHangResponse response = donHangMapper.toDonHangResponse(donHang);

        // Map chi tiết đơn hàng
        Set<ChiTietDonHang> chiTietDonHangs = donHang.getChiTietDonHangs();
        if (chiTietDonHangs != null) {
            List<ChiTietDonHangResponse> chiTietResponses = chiTietDonHangs.stream()
                    .map(chiTietDonHangMapper::toChiTietDonHangResponse)
                    .collect(Collectors.toList());
            response.setChiTietDonHangs(chiTietResponses);
        }

        return response;
    }

    @Override
    @Transactional
    public void delete(int id) {
        DonHang donHang = findByIdRaw(id);

        // Chỉ cho phép xóa đơn hàng đã hủy hoặc chưa giao
        if (donHang.getTrangThaiDonHang() == TrangThaiDonHang.DA_GIAO) {
            throw new RuntimeException("Không thể xóa đơn hàng đã giao");
        }

        donHangRepository.deleteById(id);
    }

    @Override
    public DonHang create(DonHang donHang) {
        donHang.setTrangThaiDonHang(CHUA_DUOC_GIAO);
        donHang.setNgayDat(LocalDate.now());
        return donHangRepository.save(donHang);
    }

    @Override
    @Transactional
    public DonHang createFromRequest(DonHangCreateRequest request, String email) {

        // 1. Lấy tài khoản
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        // 2. Tạo đơn hàng
        DonHang donHang = DonHang.builder()
                .ngayDat(request.getNgayDat())
                .diaChiGiaoHang(request.getDiaChiGiaoHang())
                .soDienThoai(request.getSoDienThoai())
                .ghiChu(request.getGhiChu())
                .phuongThucThanhToan(request.getPhuongThucThanhToan())
                .thueVAT(request.getThueVAT())
                .phiVanChuyen(request.getPhiVanChuyen())
                .thanhTien(request.getThanhTien())
                .trangThaiDonHang(TrangThaiDonHang.CHUA_DUOC_GIAO)
                .taiKhoan(taiKhoan)
                .build();

        // LƯU TRƯỚC để có ID
        donHang = donHangRepository.save(donHang);

        // 3. Tạo chi tiết đơn hàng
        Set<ChiTietDonHang> chiTietDonHangs = new HashSet<>();

        for (ChiTietDonHangRequest item : request.getChiTietDonHangs()) {
            NuocHoa nuocHoa = nuocHoaRepository.findById(item.getNuocHoa())
                    .orElseThrow(() -> new RuntimeException("Nước hoa không tồn tại"));

            ChiTietDonHang ct = new ChiTietDonHang(
                    donHang,
                    nuocHoa,
                    item.getSoLuong(),
                    item.getDonGia()
            );

            chiTietDonHangs.add(ct);
        }

        // 4. Gán chi tiết
        donHang.setChiTietDonHangs(chiTietDonHangs);

        // 5. LƯU LẠI (cascade sẽ lưu ChiTietDonHang)
        donHang = donHangRepository.save(donHang);

        return donHang;
    }

    @Override
    public List<DonHang> findByEmail(String email) {
        return donHangRepository.findByTaiKhoanEmail(email);
    }

}