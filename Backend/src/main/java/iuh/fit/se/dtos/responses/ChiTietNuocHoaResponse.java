package iuh.fit.se.dtos.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChiTietNuocHoaResponse {
    private int nuocHoaId;
    private List<String> hinhAnhChiTiet;
    private String xuatXu;
    private int namPhatHanh;
    private String nhomHuong;
    private String phongCachMuiHuong;
    private String moTa;
}
