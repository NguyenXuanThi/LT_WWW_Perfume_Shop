package iuh.fit.se.dtos.requests.chiTietNuocHoa;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChiTietNuocHoaCreateRequest {
    private List<String> hinhAnhChiTiet;
    @Length(max = 100, message = "Xuất xứ không được quá 100 ký tự")
    private String xuatXu;
    @Min(value = 1900, message = "Năm phát hành phải sau năm 1900")
    private int namPhatHanh;
    @Length(max = 255, message = "Nhóm hương không được quá 255 ký tự")
    private String nhomHuong;
    @Length(max = 255, message = "Phong cách mùi hương không được quá 255 ký tự")
    private String phongCachMuiHuong;
    private String moTa;
}
