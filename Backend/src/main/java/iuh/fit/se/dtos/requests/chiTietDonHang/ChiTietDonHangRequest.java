package iuh.fit.se.dtos.requests.chiTietDonHang;

import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChiTietDonHangRequest {
    private int nuocHoa;
    @Positive(message = "Số lượng phải lớn hơn 0")
    private int soLuong;
    @Positive(message = "Đơn giá phải lớn hơn 0")
    private double donGia;
    @Positive(message = "Tổng tiền phải lớn hơn 0")
    private double tongTien;

}
