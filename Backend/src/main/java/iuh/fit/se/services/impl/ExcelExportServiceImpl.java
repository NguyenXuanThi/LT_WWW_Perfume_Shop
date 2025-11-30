package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.responses.ThongKeTrangThaiDonHangResponse;
import iuh.fit.se.services.ExcelExportService;
import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportServiceImpl implements ExcelExportService {
    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,###");

    public byte[] exportDoanhThu(List<ThongKeDoanhThuResponse> data, String type) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Thống kê doanh thu");

            // Style cho header
            CellStyle headerStyle = createHeaderStyle(workbook);

            // Style cho số tiền
            CellStyle currencyStyle = createCurrencyStyle(workbook);

            // Style cho số lượng
            CellStyle numberStyle = createNumberStyle(workbook);

            // Tạo header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"STT", "Thời gian", "Doanh thu (VNĐ)", "Số đơn hàng"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Thêm dữ liệu
            int rowNum = 1;
            double tongDoanhThu = 0;
            long tongDonHang = 0;

            for (ThongKeDoanhThuResponse item : data) {
                Row row = sheet.createRow(rowNum++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(rowNum - 1);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(item.getLabel());

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getDoanhThu());
                cell2.setCellStyle(currencyStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getSoDonHang());
                cell3.setCellStyle(numberStyle);

                tongDoanhThu += item.getDoanhThu();
                tongDonHang += item.getSoDonHang();
            }

            // Thêm dòng tổng kết
            Row totalRow = sheet.createRow(rowNum);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);

            Cell totalCell1 = totalRow.createCell(1);
            totalCell1.setCellValue("");
            totalCell1.setCellStyle(headerStyle);

            Cell totalCell2 = totalRow.createCell(2);
            totalCell2.setCellValue(tongDoanhThu);
            CellStyle totalCurrencyStyle = createTotalCurrencyStyle(workbook);
            totalCell2.setCellStyle(totalCurrencyStyle);

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongDonHang);
            CellStyle totalNumberStyle = createTotalNumberStyle(workbook);
            totalCell3.setCellStyle(totalNumberStyle);

            // Tự động điều chỉnh độ rộng cột
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            // Xuất ra byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] exportTopSanPham(List<TopSanPhamResponse> data, int limit) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Top sản phẩm bán chạy");

            // Style
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle numberStyle = createNumberStyle(workbook);

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Hạng", "Mã SP", "Tên sản phẩm", "Số lượng bán", "Doanh thu (VNĐ)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Dữ liệu
            int rowNum = 1;
            long tongSoLuong = 0;
            double tongDoanhThu = 0;

            for (TopSanPhamResponse item : data) {
                Row row = sheet.createRow(rowNum++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(rowNum - 1);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(item.getSanPhamId());

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getTenSanPham());

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getSoLuongBan());
                cell3.setCellStyle(numberStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(item.getDoanhThu());
                cell4.setCellStyle(currencyStyle);

                tongSoLuong += item.getSoLuongBan();
                tongDoanhThu += item.getDoanhThu();
            }

            // Dòng tổng kết
            Row totalRow = sheet.createRow(rowNum);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);

            Cell totalCell1 = totalRow.createCell(1);
            totalCell1.setCellValue("");
            totalCell1.setCellStyle(headerStyle);

            Cell totalCell2 = totalRow.createCell(2);
            totalCell2.setCellValue("");
            totalCell2.setCellStyle(headerStyle);

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongSoLuong);
            CellStyle totalNumberStyle = createTotalNumberStyle(workbook);
            totalCell3.setCellStyle(totalNumberStyle);

            Cell totalCell4 = totalRow.createCell(4);
            totalCell4.setCellValue(tongDoanhThu);
            CellStyle totalCurrencyStyle = createTotalCurrencyStyle(workbook);
            totalCell4.setCellStyle(totalCurrencyStyle);

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorder(style);
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,##0"));
        style.setAlignment(HorizontalAlignment.RIGHT);
        setBorder(style);
        return style;
    }

    private CellStyle createNumberStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        setBorder(style);
        return style;
    }

    private CellStyle createTotalCurrencyStyle(Workbook workbook) {
        CellStyle style = createCurrencyStyle(workbook);
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private CellStyle createTotalNumberStyle(Workbook workbook) {
        CellStyle style = createNumberStyle(workbook);
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    public byte[] exportThongKeTrangThai(List<ThongKeTrangThaiDonHangResponse> data) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Thống kê trạng thái đơn hàng");

            // Style
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle numberStyle = createNumberStyle(workbook);

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"STT", "Trạng thái", "Số đơn hàng", "Tổng tiền (VNĐ)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Dữ liệu
            int rowNum = 1;
            long tongSoDonHang = 0;
            double tongTien = 0;

            for (ThongKeTrangThaiDonHangResponse item : data) {
                Row row = sheet.createRow(rowNum++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(rowNum - 1);

                Cell cell1 = row.createCell(1);
                String trangThaiText = switch(item.getTrangThai()) {
                    case CHUA_DUOC_GIAO -> "Chưa được giao";
                    case DA_GIAO -> "Đã giao";
                    case DA_HUY -> "Đã hủy";
                };
                cell1.setCellValue(trangThaiText);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getSoDonHang());
                cell2.setCellStyle(numberStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getTongTien());
                cell3.setCellStyle(currencyStyle);

                tongSoDonHang += item.getSoDonHang();
                tongTien += item.getTongTien();
            }

            // Dòng tổng kết
            Row totalRow = sheet.createRow(rowNum);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);

            Cell totalCell1 = totalRow.createCell(1);
            totalCell1.setCellValue("");
            totalCell1.setCellStyle(headerStyle);

            Cell totalCell2 = totalRow.createCell(2);
            totalCell2.setCellValue(tongSoDonHang);
            CellStyle totalNumberStyle = createTotalNumberStyle(workbook);
            totalCell2.setCellStyle(totalNumberStyle);

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongTien);
            CellStyle totalCurrencyStyle = createTotalCurrencyStyle(workbook);
            totalCell3.setCellStyle(totalCurrencyStyle);

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void setBorder(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }
}