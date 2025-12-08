package iuh.fit.se.dtos.requests.nuocHoa;

import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaCreateRequest;
import iuh.fit.se.dtos.requests.chiTietNuocHoa.ChiTietNuocHoaUpdateRequest;
import iuh.fit.se.enums.DoiTuong;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NuocHoaUpdateRequest {
    @Min(value = 1, message = "Id không được để rỗng")
    private int id;
    @NotBlank(message = "Tên sản phẩm không được rỗng")
    @Length(max = 255, message = "Tên sản phẩm không được quá 255 ký tự")
    private String tenSanPham;
    @Length(max = 255, message = "Thương hiệu không được quá 255 ký tự")
    private String thuongHieu;
    @Positive(message = "Giá gốc phải lớn hơn 0")
    private double giaGoc;
    @PositiveOrZero(message = "Khuyến mãi không được nhỏ hơn 0")
    @Max(value = 100, message = "Khuyến mãi phải dưới 100")
    private float khuyenMai;
    private String hinhAnhChinh;
    @Positive(message = "Dung tích phải lớn hơn 0")
    private double dungTich;
    private DoiTuong doiTuong;
    @NotNull(message = "Không được thiếu chi tiết nước hoa")
    private ChiTietNuocHoaUpdateRequest chiTietNuocHoa;
    private int loaiNuocHoa;
}
