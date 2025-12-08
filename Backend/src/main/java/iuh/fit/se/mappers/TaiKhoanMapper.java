package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanUpdateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.TaiKhoan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaiKhoanMapper {
    @Mapping(target = "active", constant = "true")
    TaiKhoan toTaiKhoan(TaiKhoanCreateRequest request);
    @Mapping(source = "newPassword", target = "password")
    void updateTaiKhoan(TaiKhoanUpdateRequest request, @MappingTarget TaiKhoan taiKhoan);
    @Mapping(source = "vaiTro.tenVaiTro", target = "vaiTro")
    TaiKhoanResponse toTaiKhoanRespone(TaiKhoan TaiKhoan);
}
