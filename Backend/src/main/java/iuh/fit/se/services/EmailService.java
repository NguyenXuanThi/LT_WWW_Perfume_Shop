package iuh.fit.se.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Gửi email HTML
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom("noreply@perfumeboutique.com");

        mailSender.send(message);
    }

    /**
     * Gửi email xác nhận đơn hàng
     */
    public void sendOrderConfirmationEmail(String to, String orderId, String customerName, Double total) throws MessagingException {
        String subject = "Xác nhận đơn hàng #" + orderId + " - Perfume Boutique";

        String htmlContent = buildOrderConfirmationEmail(orderId, customerName, total);

        sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * Build HTML template cho email xác nhận đơn hàng
     */
    private String buildOrderConfirmationEmail(String orderId, String customerName, Double total) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Perfume Boutique</h1>
                        <p>Cảm ơn bạn đã đặt hàng!</p>
                    </div>
                    
                    <div class="content">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Đơn hàng của bạn đã được đặt thành công và đang được xử lý.</p>
                        
                        <div class="order-info">
                            <h3>Thông tin đơn hàng</h3>
                            <p><strong>Mã đơn hàng:</strong> #%s</p>
                            <p><strong>Tổng tiền:</strong> %,.0f₫</p>
                            <p><strong>Trạng thái:</strong> Chưa được giao</p>
                        </div>
                        
                        <p>Đơn hàng của bạn sẽ được xử lý trong vòng 24 giờ và giao đến bạn trong 2-3 ngày làm việc.</p>
                        
                        <p>Bạn có thể theo dõi đơn hàng của mình tại trang web của chúng tôi.</p>
                        
                        <center>
                            <a href="http://localhost:3000/account?tab=orders" class="button">Xem đơn hàng</a>
                        </center>
                        
                        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:</p>
                        <ul>
                            <li>Hotline: 1900 0129 (9:00 - 21:00)</li>
                            <li>Email: support@perfumeboutique.com</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <p>&copy; 2024 Perfume Boutique. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(customerName, orderId, total);
    }
}
