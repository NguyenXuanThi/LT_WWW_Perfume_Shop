package iuh.fit.se.entities;

import iuh.fit.se.enums.DoiTuong;
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
@Table(name = "nuochoa")
public class NuocHoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String tenSanPham;
    private String thuongHieu;
    @Column(columnDefinition = "DOUBLE NOT NULL CHECK (giaGoc >= 0)")
    private double giaGoc;
    @Column(columnDefinition = "FLOAT DEFAULT 0 CHECK (khuyenMai >= 0 AND khuyenMai <= 100)")
    private float khuyenMai;
    @Column(columnDefinition = "text")
    private String hinhAnhChinh;
    @Column(columnDefinition = "DOUBLE CHECK (dungTich > 0)")
    private double dungTich;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DoiTuong doiTuong;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "nuocHoa")
    @ToString.Exclude
    private Set<DanhGia> danhGias;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "nuocHoa")
    @ToString.Exclude
    private Set<ChiTietDonHang> chiTietDonHangs;
    @ManyToOne
    @JoinColumn(name = "loaiNuocHoaId")
    private LoaiNuocHoa loaiNuocHoa;
    @OneToOne(mappedBy = "nuocHoa")
    private ChiTietNuocHoa chiTietNuocHoa;
}
