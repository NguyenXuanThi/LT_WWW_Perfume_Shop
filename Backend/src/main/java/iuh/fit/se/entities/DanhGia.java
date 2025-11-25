package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.UniqueElements;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "danhgia",
    uniqueConstraints = {
        @UniqueConstraint(
                columnNames = {"taiKhoanId", "nuocHoaId"}
        )
    }
)
public class DanhGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private float mucDanhGia;
    @ManyToOne
    @JoinColumn(name = "taiKhoanId", nullable = false)
    private TaiKhoan taiKhoan;
    @ManyToOne
    @JoinColumn(name = "nuocHoaId", nullable = false)
    private NuocHoa nuocHoa;
}
