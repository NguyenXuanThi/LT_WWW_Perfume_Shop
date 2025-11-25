package iuh.fit.se.dtos.requests.donHang;

import iuh.fit.se.enums.TrangThaiDonHang;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DonHangUpdateRequest {
    private int id;
    private TrangThaiDonHang trangThaiDonHang;
}
