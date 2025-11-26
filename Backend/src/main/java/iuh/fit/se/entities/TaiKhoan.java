package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "taikhoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String hoTen;
    private LocalDate ngaySinh;
    @Column(nullable = false, unique = true, length = 10)
    private String soDienThoai;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(columnDefinition = "text")
    private String diaChi;
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean active;
    @ManyToOne
    @JoinColumn(name = "vaiTroId")
    private VaiTro vaiTro;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "taiKhoan")
    @ToString.Exclude
    private Set<DonHang> donHangs;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "taiKhoan")
    @ToString.Exclude
    private Set<DanhGia> danhGias;
}
