package iuh.fit.se.dtos.requests.danhGia;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DanhGiaRequest {
    @DecimalMin(value = "0.5", message = "Mức đánh giá phải trên 0.5")
    @Max(value = 5, message = "Mức đánh giá không được trên 5")
    private float mucDanhGia;
    private int taiKhoan;
    private int nuocHoa;
}
