package iuh.fit.se.services;

import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.entities.NuocHoa;

public interface NuocHoaService {
    NuocHoa findByIdRaw(int id);
    NuocHoaResponse findById(int id);
}
