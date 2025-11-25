package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.ChiTietNuocHoaResponse;
import iuh.fit.se.entities.ChiTietNuocHoa;
import iuh.fit.se.services.NuocHoaService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {NuocHoaService.class})
public interface ChiTietNuocHoaMapper {
    ChiTietNuocHoa toChiTietNuocHoa(ChiTietNuocHoaCreateRequest request);
    @Mapping(target = "nuocHoaId", ignore = true)
    void updateChiTietNuocHoa(ChiTietNuocHoaUpdateRequest request, @MappingTarget ChiTietNuocHoa chiTietNuocHoa);
    ChiTietNuocHoaResponse toChiTietNuocHoaResponse(ChiTietNuocHoa chiTietNuocHoa);
}
