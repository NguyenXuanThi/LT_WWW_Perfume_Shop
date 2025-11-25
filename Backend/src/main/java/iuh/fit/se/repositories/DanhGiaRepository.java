package iuh.fit.se.repositories;

import iuh.fit.se.entities.DanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DanhGiaRepository extends JpaRepository<DanhGia, Integer> {
    @Query("select avg(mucDanhGia) from DanhGia where nuocHoa = :nuocHoa")
    double avgMucDanhGiaByNuocHoa(int nuocHoa);
}
