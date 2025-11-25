package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chitietdonhang")
@IdClass(ChiTietDonHang.ChiTietDonHangId.class)
public class ChiTietDonHang {
    @Id
    @ManyToOne
    @JoinColumn(name = "donHangId")
    private DonHang donHang;
    @Id
    @ManyToOne
    @JoinColumn(name = "nuocHoaId")
    private NuocHoa nuocHoa;
    @Column(columnDefinition = "INT NOT NULL CHECK (soLuong > 0)")
    private int soLuong;
    @Column(columnDefinition = "DOUBLE NOT NULL CHECK (donGia >= 0)")
    private double donGia;
    @Column(columnDefinition = "DOUBLE NOT NULL CHECK (tongTien >= 0)")
    private double tongTien;

    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    static class ChiTietDonHangId {
        private DonHang donHang;
        private NuocHoa nuocHoa;
    }

    public ChiTietDonHang(DonHang donHang, NuocHoa nuocHoa, int soLuong, double donGia) {
        this.donHang = donHang;
        this.nuocHoa = nuocHoa;
        this.soLuong = soLuong;
        this.donGia = donGia;
        tinhTongTien();
    }

    public void tinhTongTien() {
        this.tongTien = soLuong * donGia;
    }
}
