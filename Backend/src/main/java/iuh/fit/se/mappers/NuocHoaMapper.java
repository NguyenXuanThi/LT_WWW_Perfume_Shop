package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.services.LoaiNuocHoaService;
import org.mapstruct.*; // Import thêm

@Mapper(componentModel = "spring", uses = {LoaiNuocHoaService.class})
public interface NuocHoaMapper {
    @Mapping(target = "chiTietNuocHoa", ignore = true)
    NuocHoa toNuocHoa(NuocHoaCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "chiTietNuocHoa", ignore = true)
    void updateNuocHoa(NuocHoaUpdateRequest request, @MappingTarget NuocHoa nuocHoa);

    @Mapping(source = "loaiNuocHoa.id", target = "loaiNuocHoa")
    @Mapping(target = "mucDanhGia",
            expression = "java(nuocHoa.getDanhGias() != null? " +
                    "nuocHoa.getDanhGias().stream().mapToDouble(i -> i.getMucDanhGia()).average().orElse(0.0): " +
                    "0.0)"
    )
    NuocHoaResponse toNuocHoaResponse(NuocHoa nuocHoa);
}