package iuh.fit.se.dtos.requests.taiKhoan;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TaiKhoanUpdateRequest {
    @NotBlank(message = "Tên không được để trống")
    @Pattern(regexp = "^[A-ZĐÂ].+( [A-ZĐÂ].+)*$", message = "Tên phải bắt đầu bằng chữ hoa")
    private String hoTen;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngaySinh;
    @Pattern(regexp = "^\\d{10}$", message = "Sai định dạng số điện thoại")
    private String soDienThoai;
    @Email(message = "Phải đúng định dạng email")
    private String email;
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$", message = "Mật khẩu phải trên 8 ký tự, có chữ hoa, thường và số")
    private String currentPassword;
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$", message = "Mật khẩu phải trên 8 ký tự, có chữ hoa, thường và số")
    private String newPassword;
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$", message = "Mật khẩu phải trên 8 ký tự, có chữ hoa, thường và số")
    private String confirmPassword;
    @Length(max = 255)
    private String diaChi;
}
