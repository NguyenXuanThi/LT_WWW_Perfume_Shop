package iuh.fit.se.entities;

import iuh.fit.se.enums.TrangThaiDonHang;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "donhang")
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private LocalDate ngayDat;
    @Column(columnDefinition = "DOUBLE NOT NULL CHECK (thanhTien >= 0)")
    private double thanhTien;
    @Column(length = 100)
    private String phuongThucThanhToan;
    @Column(columnDefinition = "text", nullable = false)
    private String diaChiGiaoHang;
    @Column(nullable = false, length = 10)
    private String soDienThoai;
    @Column(columnDefinition = "text")
    private String ghiChu;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('CHUA_DUOC_GIAO', 'DA_GIAO', 'DA_HUY') DEFAULT 'CHUA_DUOC_GIAO'")
    private TrangThaiDonHang trangThaiDonHang;
    private double thueVAT;
    @Column(columnDefinition = "DOUBLE DEFAULT 30000")
    private double phiVanChuyen;
    @ManyToOne
    @JoinColumn(name = "taiKhoanId", nullable = false)
    private TaiKhoan taiKhoan;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<ChiTietDonHang> chiTietDonHangs;

    public DonHang(LocalDate ngayDat, String phuongThucThanhToan, String diaChiGiaoHang, String soDienThoai, String ghiChu, TrangThaiDonHang trangThaiDonHang, double thueVAT, double phiVanChuyen) {
        this.ngayDat = ngayDat;
        this.phuongThucThanhToan = phuongThucThanhToan;
        this.diaChiGiaoHang = diaChiGiaoHang;
        this.soDienThoai = soDienThoai;
        this.ghiChu = ghiChu;
        this.trangThaiDonHang = trangThaiDonHang;
        this.thueVAT = thueVAT;
        this.phiVanChuyen = phiVanChuyen;
        this.thanhTien = tinhThanhTien();
    }

    public void setChiTietDonHangs(Set<ChiTietDonHang> chiTietDonHangs) {
        this.chiTietDonHangs = chiTietDonHangs;
        this.thanhTien = tinhThanhTien();
    }

    // Có thể không cần thiết
    public boolean addChiTietDonHang(ChiTietDonHang chiTietDonHang) {
        if (this.chiTietDonHangs == null) {
            this.chiTietDonHangs = new HashSet<>();
            this.chiTietDonHangs.add(chiTietDonHang);
            this.thanhTien = tinhThanhTien();
            return true;
        }

        this.chiTietDonHangs.add(chiTietDonHang);
        this.thanhTien = chiTietDonHang.getTongTien() * (1 + this.thueVAT);
        return true;
    }

    public double tinhThanhTien() {
        double thanhTien = 0;
        thanhTien = chiTietDonHangs != null? chiTietDonHangs.stream().map(ChiTietDonHang::getTongTien).reduce(0.0, Double::sum): 0;
        thanhTien += phiVanChuyen;
        thanhTien += thueVAT;
        return thanhTien;
    }
}
