package iuh.fit.se.dtos.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopSanPhamResponse {
    private Integer sanPhamId;
    private String tenSanPham;
    private String hinhAnh;
    private Long soLuongBan;
    private Double doanhThu;
}