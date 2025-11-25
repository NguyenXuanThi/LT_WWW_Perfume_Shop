package iuh.fit.se.repositories;

import iuh.fit.se.entities.ChiTietNuocHoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChiTietNuocHoaRepository extends JpaRepository<ChiTietNuocHoa, Integer> {
//    List<ChiTietNuocHoa> findByNuocHoa_Id(int nuocHoaId);
}
