package iuh.fit.se.dtos.responses;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongKeDoanhThuResponse {
    private String label; // "2024-01-15", "Tháng 1/2024", "2024"
    private Double doanhThu;
    private Long soDonHang;
}
