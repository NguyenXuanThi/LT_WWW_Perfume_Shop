package iuh.fit.se.mappers;

import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.LoaiNuocHoaResponse;
import iuh.fit.se.entities.LoaiNuocHoa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LoaiNuocHoaMapper {
    @Mapping(target = "id", ignore = true)
    LoaiNuocHoa toLoaiNuocHoa(LoaiNuocHoaCreateRequest request);
    @Mapping(target = "id", ignore = true)
    void updateLoaiNuocHoa(LoaiNuocHoaUpdateRequest request, @MappingTarget LoaiNuocHoa loaiNuocHoa);
    LoaiNuocHoaResponse toLoaiNuocHoaResponse(LoaiNuocHoa loaiNuocHoa);
}
