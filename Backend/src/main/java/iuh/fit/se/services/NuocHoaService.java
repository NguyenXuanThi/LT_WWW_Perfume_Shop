package iuh.fit.se.services;

import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaUpdateRequest;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.enums.DoiTuong;

import java.util.List;

public interface NuocHoaService {
    NuocHoa findByIdRaw(int id);
    NuocHoaResponse findById(int id);
    List<NuocHoaResponse> findAll(String tenSanPham, String thuongHieu, DoiTuong doiTuong,
                                  Integer loaiNuocHoaId, Double minPrice, Double maxPrice);
    NuocHoaResponse create(NuocHoaCreateRequest request);
    NuocHoaResponse update(NuocHoaUpdateRequest request);
    void delete(int id);
    List<NuocHoaResponse> search(String keyword);
}