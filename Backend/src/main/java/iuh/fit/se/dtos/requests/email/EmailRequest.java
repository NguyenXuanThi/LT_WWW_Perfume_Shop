package iuh.fit.se.dtos.requests.email;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {
    private String to;
    private String subject;
    private String body;

    // For order confirmation
    private String orderId;
    private String customerName;
    private Double total;
}
