package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chitietnuochoa")
public class ChiTietNuocHoa {
    @Id
    private int nuocHoaId;
    @MapsId
    @OneToOne
    @JoinColumn(name = "nuocHoaId")
    @ToString.Exclude
    private NuocHoa nuocHoa;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "hinhanhnuochoa",
            joinColumns = @JoinColumn(name = "nuocHoaId")
    )
    @Column(name = "urlHinhAnh", columnDefinition = "text", nullable = false)
    private List<String> hinhAnhChiTiet;
    @Column(length = 100)
    private String xuatXu;
    @Column(columnDefinition = "INT CHECK (namPhatHanh >= 1900)")
    private int namPhatHanh;
    private String nhomHuong;
    private String phongCachMuiHuong;
    @Column(columnDefinition = "text")
    private String moTa;
}
