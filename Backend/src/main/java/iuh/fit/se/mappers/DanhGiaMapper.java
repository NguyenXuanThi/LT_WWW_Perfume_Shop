package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.danhGia.DanhGiaRequest;
import iuh.fit.se.entities.DanhGia;
import iuh.fit.se.services.NuocHoaService;
import iuh.fit.se.services.TaiKhoanService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TaiKhoanService.class, NuocHoaService.class})
public interface DanhGiaMapper {
    DanhGia toDanhGia(DanhGiaRequest request);
}
