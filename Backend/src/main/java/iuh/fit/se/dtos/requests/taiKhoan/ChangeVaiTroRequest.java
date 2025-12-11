package iuh.fit.se.dtos.requests.taiKhoan;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChangeVaiTroRequest {
    private String emailNeedChange;
    private String emailExecute;
    private String vaiTro;
}
