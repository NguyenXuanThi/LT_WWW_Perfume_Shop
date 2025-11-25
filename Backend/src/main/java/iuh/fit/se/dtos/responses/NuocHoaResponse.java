package iuh.fit.se.dtos.responses;

import iuh.fit.se.enums.DoiTuong;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NuocHoaResponse {
    private int id;
    private String tenSanPham;
    private String thuongHieu;
    private double giaGoc;
    private float khuyenMai;
    private String hinhAnhChinh;
    private double dungTich;
    private DoiTuong doiTuong;
    private ChiTietNuocHoaResponse chiTietNuocHoa;
    private int loaiNuocHoa;
    private double mucDanhGia;
}
