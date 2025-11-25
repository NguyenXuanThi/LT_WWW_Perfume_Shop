package iuh.fit.se.dtos.requests.loaiNuocHoa;

import iuh.fit.se.enums.TenLoai;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoaiNuocHoaUpdateRequest {
    private int id;
    private TenLoai tenLoai;
    private String moTa;
    @Length(max = 100, message = "Nồng độ tinh dầu không được quá 100 ký tự")
    private String nongDoTinhDau;
    @Length(max = 100, message = "Độ lưu hương không được quá 100 ký tự")
    private String doLuuHuong;
    @Length(max = 100, message = "Độ tỏa hương không được quá 100 ký tự")
    private String doToaHuong;
}
