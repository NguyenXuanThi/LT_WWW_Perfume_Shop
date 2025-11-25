package iuh.fit.se.dtos.responses;

import iuh.fit.se.entities.VaiTro;
import iuh.fit.se.enums.TenVaiTro;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TaiKhoanResponse {
    private String hoTen;
    private LocalDate ngaySinh;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private TenVaiTro vaiTro;
}
