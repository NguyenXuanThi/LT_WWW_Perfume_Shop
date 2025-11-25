package iuh.fit.se.controllers;

import iuh.fit.se.dtos.requests.auth.LoginRequest;
import iuh.fit.se.dtos.requests.chiTietDonHang.ChiTietDonHangRequest;
import iuh.fit.se.dtos.requests.danhGia.DanhGiaRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangCreateRequest;
import iuh.fit.se.dtos.requests.donHang.DonHangUpdateRequest;
import iuh.fit.se.dtos.requests.nuocHoa.NuocHoaCreateRequest;
import iuh.fit.se.dtos.responses.ChiTietDonHangResponse;
import iuh.fit.se.dtos.responses.DonHangResponse;
import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.dtos.responses.TaiKhoanResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.enums.TrangThaiDonHang;
import iuh.fit.se.mappers.*;
import iuh.fit.se.security.JwtTokenService;
import iuh.fit.se.services.DonHangService;
import iuh.fit.se.services.NuocHoaService;
import iuh.fit.se.services.TaiKhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    private final NuocHoaMapper nuocHoaMapper;
    private final NuocHoaService nuocHoaService;
    private final ChiTietNuocHoaMapper chiTietNuocHoaMapper;
    private final DanhGiaMapper danhGiaMapper;
    private final DonHangMapper donHangMapper;
    private final ChiTietDonHangMapper chiTietDonHangMapper;
    private final DonHangService donHangService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final TaiKhoanService taiKhoanService;

    @PostMapping("/nuocHoa")
    public NuocHoaResponse add(@RequestBody NuocHoaCreateRequest request) {
        System.out.println(request);
        NuocHoa nuocHoa = nuocHoaMapper.toNuocHoa(request);
        ChiTietNuocHoa chiTietNuocHoa = chiTietNuocHoaMapper.toChiTietNuocHoa(request.getChiTietNuocHoa());
        nuocHoa.setId(1);
        chiTietNuocHoa.setNuocHoaId(1);
        chiTietNuocHoa.setNuocHoa(nuocHoa);
        nuocHoa.setChiTietNuocHoa(chiTietNuocHoa);
        return nuocHoaMapper.toNuocHoaResponse(nuocHoa);
    }

    @PostMapping("/danhGia")
    public String add(@RequestBody DanhGiaRequest request) {
        return danhGiaMapper.toDanhGia(request).toString();
    }

    @PostMapping("/donHang")
    public DonHangResponse addDonHang(@RequestBody DonHangCreateRequest request) {
        DonHang donHang = donHangMapper.toDonHang(request);
        donHang.setId(1);
        donHang.setTrangThaiDonHang(TrangThaiDonHang.CHUA_DUOC_GIAO);

        List<ChiTietDonHangRequest> chiTietDonHangRequests = request.getChiTietDonHangs();
        Set<ChiTietDonHang> chiTietDonHangs = chiTietDonHangRequests.stream().map(chiTietDonHangMapper::toChiTietDonHang).collect(Collectors.toSet());
        chiTietDonHangs.forEach(i -> i.setDonHang(donHang));
        donHang.setChiTietDonHangs(chiTietDonHangs);

        DonHangResponse donHangResponse = donHangMapper.toDonHangResponse(donHang);
        List<ChiTietDonHangResponse> chiTietDonHangResponses = chiTietDonHangs.stream().map(chiTietDonHangMapper::toChiTietDonHangResponse).toList();
        donHangResponse.setChiTietDonHangs(chiTietDonHangResponses);

        return donHangResponse;
    }

    @PutMapping("/donHang/{id}")
    public DonHangResponse update(@RequestBody DonHangUpdateRequest request, @PathVariable int id) {
        DonHang donHang = donHangService.findByIdRaw(id);
        donHangMapper.updateDonHang(request, donHang);

        Set<ChiTietDonHang> chiTietDonHangs = donHang.getChiTietDonHangs();
        List<ChiTietDonHangResponse> chiTietDonHangResponses = chiTietDonHangs.stream().map(chiTietDonHangMapper::toChiTietDonHangResponse).toList();

        DonHangResponse response = donHangMapper.toDonHangResponse(donHang);
        response.setChiTietDonHangs(chiTietDonHangResponses);
        return response;
    }

    @GetMapping("/nuocHoa/{id}")
    public NuocHoaResponse findNuocHoaById(@PathVariable int id) {
        return nuocHoaService.findById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtTokenService.generateToken(userDetails);

        return ResponseEntity.ok(Map.of("token", token, "tokenType", "Bearer"));
    }

    @GetMapping("/taiKhoan/{email}")
    @PreAuthorize("(hasRole('Admin')) or (authentication.name == #email)")
    public TaiKhoanResponse findTaiKhoanById(@PathVariable String email) {
        return taiKhoanService.findByEmail(email);
    }
}
