package iuh.fit.se.services;

import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.loaiNuocHoa.LoaiNuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.LoaiNuocHoaResponse;
import iuh.fit.se.entities.LoaiNuocHoa;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LoaiNuocHoaService {
    LoaiNuocHoa findByIdRaw(int id);

    LoaiNuocHoaResponse findById(int id);

    List<LoaiNuocHoaResponse> findAll();

    @Transactional
    LoaiNuocHoaResponse create(LoaiNuocHoaCreateRequest request);

    @Transactional
    LoaiNuocHoaResponse update(LoaiNuocHoaUpdateRequest request);

    @Transactional
    void delete(int id);
}
