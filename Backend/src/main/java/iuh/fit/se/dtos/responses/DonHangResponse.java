package iuh.fit.se.dtos.responses;

import iuh.fit.se.enums.TrangThaiDonHang;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DonHangResponse {
    private int id;
    private LocalDate ngayDat;
    private double thanhTien;
    private String phuongThucThanhToan;
    private String diaChiGiaoHang;
    private String soDienThoai;
    private String ghiChu;
    private TrangThaiDonHang trangThaiDonHang;
    private double thueVAT;
    private double phiVanChuyen;
    private int taiKhoan;
    private List<ChiTietDonHangResponse> chiTietDonHangs;
}
