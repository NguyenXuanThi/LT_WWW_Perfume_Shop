package iuh.fit.se.controllers;

import iuh.fit.se.dtos.responses.NuocHoaResponse;
import iuh.fit.se.enums.DoiTuong;
import iuh.fit.se.services.NuocHoaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nuochoa")
@CrossOrigin(origins = "*")
public class NuocHoa2Controller {

    @Autowired
    private NuocHoaService nuocHoaService;

    // Lấy tất cả + filter
    @GetMapping
    public List<NuocHoaResponse> getAll(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String thuongHieu,
            @RequestParam(required = false) DoiTuong doiTuong,
            @RequestParam(required = false) Integer loaiNuocHoaId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return nuocHoaService.findAll(
                tenSanPham,
                thuongHieu,
                doiTuong,
                loaiNuocHoaId,
                minPrice,
                maxPrice
        );
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public NuocHoaResponse getById(@PathVariable int id) {
        return nuocHoaService.findById(id);
    }

    // Search theo keyword
    @GetMapping("/search")
    public List<NuocHoaResponse> search(@RequestParam String keyword) {
        return nuocHoaService.search(keyword);
    }
}
