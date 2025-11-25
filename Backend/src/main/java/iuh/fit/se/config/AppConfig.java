package iuh.fit.se.config;

import iuh.fit.se.services.ChiTietNuocHoaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    CommandLineRunner runner(ChiTietNuocHoaService chiTietNuocHoaService) {
        return args -> {
            System.out.println(chiTietNuocHoaService.findById(1));
        };
    }
}
