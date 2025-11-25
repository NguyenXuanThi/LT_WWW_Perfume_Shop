package iuh.fit.se.dtos.responses;

import iuh.fit.se.enums.TenLoai;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoaiNuocHoaResponse {
    private int id;
    private TenLoai tenLoai;
    private String moTa;
    private String nongDoTinhDau;
    private String doLuuHuong;
    private String doToaHuong;
}
