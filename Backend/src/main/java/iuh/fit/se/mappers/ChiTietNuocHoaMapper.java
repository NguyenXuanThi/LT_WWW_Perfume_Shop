package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.ChiTietNuocHoaResponse;
import iuh.fit.se.entities.ChiTietNuocHoa;
import iuh.fit.se.services.NuocHoaService;
import org.mapstruct.*; // Import thêm BeanMapping và NullValuePropertyMappingStrategy

@Mapper(componentModel = "spring", uses = {NuocHoaService.class})
public interface ChiTietNuocHoaMapper {
    ChiTietNuocHoa toChiTietNuocHoa(ChiTietNuocHoaCreateRequest request);
    ChiTietNuocHoa toChiTietNuocHoa(ChiTietNuocHoaUpdateRequest request);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "nuocHoaId", ignore = true)
    void updateChiTietNuocHoa(ChiTietNuocHoaUpdateRequest request, @MappingTarget ChiTietNuocHoa chiTietNuocHoa);
    ChiTietNuocHoaResponse toChiTietNuocHoaResponse(ChiTietNuocHoa chiTietNuocHoa);
}