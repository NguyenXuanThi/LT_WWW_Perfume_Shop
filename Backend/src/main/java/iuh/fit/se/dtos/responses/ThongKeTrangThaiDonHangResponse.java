package iuh.fit.se.dtos.responses;

import iuh.fit.se.enums.TrangThaiDonHang;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongKeTrangThaiDonHangResponse {
    private TrangThaiDonHang trangThai;
    private Long soDonHang;
    private Double tongTien;
}