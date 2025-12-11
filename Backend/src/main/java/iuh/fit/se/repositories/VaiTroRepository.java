package iuh.fit.se.repositories;

import iuh.fit.se.entities.VaiTro;
import iuh.fit.se.enums.TenVaiTro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {
    List<VaiTro> findByTenVaiTro(TenVaiTro tenVaiTro);
}
