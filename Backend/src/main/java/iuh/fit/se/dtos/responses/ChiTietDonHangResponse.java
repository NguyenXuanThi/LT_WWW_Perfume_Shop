package iuh.fit.se.dtos.responses;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChiTietDonHangResponse {
    private int donHang;
    private int nuocHoa;
    private int soLuong;
    private double donGia;
    private double tongTien;
}
