package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.donHang.DonHangCreateRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.services.TaiKhoanService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TaiKhoanService.class})
public interface DonHangMapper {
    @Mapping(target = "chiTietDonHangs", ignore = true)
    DonHang toDonHang(DonHangCreateRequest request);
    @Mapping(target = "id", ignore = true)
    void updateDonHang(DonHangUpdateRequest request, @MappingTarget DonHang donHang);
    @Mapping(target = "chiTietDonHangs", ignore = true)
    @Mapping(source = "taiKhoan.id", target = "taiKhoan")
    DonHangResponse toDonHangResponse(DonHang donHang);
}
