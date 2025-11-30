package iuh.fit.se.services;

import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.ThongKeTrangThaiDonHangResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;

import java.io.IOException;
import java.util.List;

public interface ExcelExportService {
    byte[] exportDoanhThu(List<ThongKeDoanhThuResponse> data, String type) throws IOException;
    byte[] exportTopSanPham(List<TopSanPhamResponse> data, int limit) throws IOException;
    byte[] exportThongKeTrangThai(List<ThongKeTrangThaiDonHangResponse> data) throws IOException;
}