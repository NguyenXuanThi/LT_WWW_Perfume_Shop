package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.email.EmailRequest;
import iuh.fit.se.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /**
     * Gửi email xác nhận đơn hàng
     */
    @PostMapping("/send")
    public ApiResponse<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendHtmlEmail(
                    request.getTo(),
                    request.getSubject(),
                    request.getBody()
            );
            return ApiResponse.<String>builder()
                    .message("Email đã được gửi thành công")
                    .body("SUCCESS")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Không thể gửi email: " + e.getMessage())
                    .body("FAILED")
                    .build();
        }
    }

    /**
     * Gửi email xác nhận đơn hàng sau khi thanh toán
     */
    @PostMapping("/order-confirmation")
    public ApiResponse<String> sendOrderConfirmation(@RequestBody EmailRequest request) {
        try {
            emailService.sendOrderConfirmationEmail(
                    request.getTo(),
                    request.getOrderId(),
                    request.getCustomerName(),
                    request.getTotal()
            );
            return ApiResponse.<String>builder()
                    .message("Email xác nhận đơn hàng đã được gửi")
                    .body("SUCCESS")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Không thể gửi email: " + e.getMessage())
                    .body("FAILED")
                    .build();
        }
    }
}

