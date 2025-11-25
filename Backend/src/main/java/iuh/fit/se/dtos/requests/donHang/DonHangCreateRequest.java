package iuh.fit.se.dtos.requests.donHang;

import iuh.fit.se.dtos.requests.chiTietDonHang.ChiTietDonHangRequest;
import iuh.fit.se.enums.TrangThaiDonHang;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DonHangCreateRequest {
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayDat;
    @Positive(message = "Thành tiền phải trên 0")
    private double thanhTien;
    @Length(max = 100, message = "Phương thức thanh toán không được quá 100 ký tự")
    private String phuongThucThanhToan;
    private String diaChiGiaoHang;
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String soDienThoai;
    private String ghiChu;
    @Positive(message = "Thuế VAT phải lớn hơn 0")
    private double thueVAT;
    @PositiveOrZero(message = "Thuế VAT phải lớn hơn hoặc bằng 0")
    private double phiVanChuyen;
    private int taiKhoan;
    @NotNull(message = "Chi tiết đơn hàng không được trống")
    private List<ChiTietDonHangRequest> chiTietDonHangs;
}
