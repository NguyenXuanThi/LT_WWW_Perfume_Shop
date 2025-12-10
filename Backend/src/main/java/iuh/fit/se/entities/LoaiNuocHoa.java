package iuh.fit.se.entities;

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

    @Column(nullable = false, unique = true)
    private String tenLoai;

    @Column(columnDefinition = "text")
    private String moTa;
    @Column(length = 100)
    private String nongDoTinhDau;
    @Column(length = 100)
    private String doLuuHuong;
    @Column(length = 100)
    private String doToaHuong;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "loaiNuocHoa")
    @ToString.Exclude
    private Set<NuocHoa> nuocHoas;
}