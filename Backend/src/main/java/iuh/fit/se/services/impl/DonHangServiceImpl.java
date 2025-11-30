package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.responses.ChiTietDonHangResponse;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.ChiTietDonHang;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.mappers.ChiTietDonHangMapper;
import iuh.fit.se.mappers.DonHangMapper;
import iuh.fit.se.repositories.DonHangRepository;
import iuh.fit.se.services.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonHangServiceImpl implements DonHangService {
    private final DonHangRepository donHangRepository;
    private final DonHangMapper donHangMapper;
    private final ChiTietDonHangMapper chiTietDonHangMapper;

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
}