package iuh.fit.se.entities;

import iuh.fit.se.enums.TenVaiTro;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vaitro")
public class VaiTro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private TenVaiTro tenVaiTro;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vaiTro")
    @ToString.Exclude
    Set<TaiKhoan> taiKhoans;
}
