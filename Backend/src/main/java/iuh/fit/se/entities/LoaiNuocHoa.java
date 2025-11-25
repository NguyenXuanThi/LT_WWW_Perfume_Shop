package iuh.fit.se.entities;

import iuh.fit.se.enums.TenLoai;
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
@Table(name = "loainuochoa")
public class LoaiNuocHoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    private TenLoai tenLoai;
    @Column(columnDefinition = "text")
    private String moTa;
    private String nongDoTinhDau;
    private String doLuuHuong;
    private String doToaHuong;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "loaiNuocHoa")
    @ToString.Exclude
    private Set<NuocHoa> nuocHoas;
}
