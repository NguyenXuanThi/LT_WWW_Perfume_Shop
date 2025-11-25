package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.chiTietDonHang.ChiTietDonHangRequest;
import iuh.fit.se.dtos.responses.ChiTietDonHangResponse;
import iuh.fit.se.entities.ChiTietDonHang;
import iuh.fit.se.services.NuocHoaService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {NuocHoaService.class})
public interface ChiTietDonHangMapper {
    ChiTietDonHang toChiTietDonHang(ChiTietDonHangRequest request);
    @Mapping(source = "donHang.id", target = "donHang")
    @Mapping(source = "nuocHoa.id", target = "nuocHoa")
    ChiTietDonHangResponse toChiTietDonHangResponse(ChiTietDonHang chiTietDonHang);
}
