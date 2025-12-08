package iuh.fit.se.repositories;

import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.enums.TenVaiTro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    List<TaiKhoan> findByEmail(String email);
    @Query("""
        SELECT tk FROM TaiKhoan tk 
        WHERE 
            (:searchKey IS NULL OR :searchKey = '' OR 
             LOWER(tk.hoTen) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR 
             LOWER(tk.email) LIKE LOWER(CONCAT('%', :searchKey, '%')))
        AND 
            (:roleName IS NULL OR :roleName = '' OR tk.vaiTro.tenVaiTro = :roleName)
        AND 
            (:status IS NULL OR tk.active = :status)
        """)
    Page<TaiKhoan> searchAndFilterTaiKhoan(
            @Param("searchKey") String searchKey,
            @Param("roleName") TenVaiTro roleName,
            @Param("status") Boolean status,
            Pageable pageable
    );
}
