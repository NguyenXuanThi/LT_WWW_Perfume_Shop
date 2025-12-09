package iuh.fit.se.repositories;

import iuh.fit.se.entities.NuocHoa;
import iuh.fit.se.enums.DoiTuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NuocHoaRepository extends JpaRepository<NuocHoa, Integer> {

    @Query("SELECT n FROM NuocHoa n WHERE " +
            "(:tenSanPham IS NULL OR LOWER(n.tenSanPham) LIKE LOWER(CONCAT('%', :tenSanPham, '%'))) AND " +
            "(:thuongHieu IS NULL OR LOWER(n.thuongHieu) LIKE LOWER(CONCAT('%', :thuongHieu, '%'))) AND " +
            "(:doiTuong IS NULL OR n.doiTuong = :doiTuong) AND " +
            "(:loaiNuocHoaId IS NULL OR n.loaiNuocHoa.id = :loaiNuocHoaId) AND " +
            "(:minPrice IS NULL OR n.giaGoc >= :minPrice) AND " +
            "(:maxPrice IS NULL OR n.giaGoc <= :maxPrice) " +
            "ORDER BY n.id DESC")
    List<NuocHoa> findAllWithFilters(
            @Param("tenSanPham") String tenSanPham,
            @Param("thuongHieu") String thuongHieu,
            @Param("doiTuong") DoiTuong doiTuong,
            @Param("loaiNuocHoaId") Integer loaiNuocHoaId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

    @Query("SELECT n FROM NuocHoa n WHERE " +
            "LOWER(n.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.thuongHieu) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY n.id DESC")
    List<NuocHoa> searchByKeyword(@Param("keyword") String keyword);

    boolean existsNuocHoaByHinhAnhChinh(String hinhAnhChinh);

    boolean existsNuocHoaByChiTietNuocHoa_HinhAnhChiTietContaining(String urlHinhAnh);
}