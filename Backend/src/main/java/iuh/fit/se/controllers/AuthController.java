package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ApiResponse;
import iuh.fit.se.dtos.requests.auth.LoginRequest;
import iuh.fit.se.dtos.requests.taiKhoan.TaiKhoanCreateRequest;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.security.JwtTokenService;
import iuh.fit.se.services.TaiKhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final TaiKhoanService taiKhoanService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenService.generateToken(userDetails);

        TaiKhoanResponse taiKhoanResponse = taiKhoanService.findByEmail(userDetails.getUsername());

        return ApiResponse.<Map<String, Object>>builder()
                .body(Map.of("token", token, "user", taiKhoanResponse)).build();
    }

    @PostMapping("/register")
    public ApiResponse<Boolean> register(@RequestBody TaiKhoanCreateRequest request) {
        boolean response = taiKhoanService.register(request);
        return ApiResponse.<Boolean>builder()
                .body(response).build();
    }
}
