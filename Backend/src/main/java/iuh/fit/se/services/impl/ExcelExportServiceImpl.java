package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.responses.ThongKeDoanhThuResponse;
import iuh.fit.se.dtos.responses.ThongKeTrangThaiDonHangResponse;
import iuh.fit.se.dtos.responses.TopSanPhamResponse;
import iuh.fit.se.services.ExcelExportService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
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
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ==========================================
    // 1. XUẤT BÁO CÁO DOANH THU
    // ==========================================
    @Override
    public byte[] exportDoanhThu(List<ThongKeDoanhThuResponse> data, String type) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Thống kê doanh thu");

            // Tạo các Style
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle subTitleStyle = createSubTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle numberStyle = createNumberStyle(workbook);
            CellStyle centerStyle = createCenterStyle(workbook);

            // --- PHẦN HEADER BÁO CÁO ---
            int rowIndex = 0;

            // Dòng 1: Tên công ty (Optional)
            Row companyRow = sheet.createRow(rowIndex++);
            companyRow.createCell(0).setCellValue("PERFUME BOUTIQUE");

            // Dòng 2: Tiêu đề lớn (Merge cells)
            rowIndex++; // Cách 1 dòng
            Row titleRow = sheet.createRow(rowIndex++);
            Cell titleCell = titleRow.createCell(0);

            String titleText = switch (type) {
                case "ngay" -> "BÁO CÁO DOANH THU THEO NGÀY";
                case "thang" -> "BÁO CÁO DOANH THU THEO THÁNG";
                case "nam" -> "BÁO CÁO DOANH THU THEO NĂM";
                default -> "BÁO CÁO DOANH THU";
            };
            titleCell.setCellValue(titleText);
            titleCell.setCellStyle(titleStyle);
            // Merge từ cột A đến cột D (4 cột)
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 3));

            // Dòng 3: Ngày xuất báo cáo
            Row dateRow = sheet.createRow(rowIndex++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Ngày xuất báo cáo: " + LocalDate.now().format(DATE_FORMATTER));
            dateCell.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 3));

            rowIndex++; // Cách 1 dòng trước khi vào bảng

            // --- PHẦN BẢNG DỮ LIỆU ---

            // Header Bảng
            Row headerRow = sheet.createRow(rowIndex++);
            String[] headers = {"STT", "Thời gian", "Doanh thu (VNĐ)", "Số đơn hàng"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Dữ liệu
            int stt = 1;
            double tongDoanhThu = 0;
            long tongDonHang = 0;

            for (ThongKeDoanhThuResponse item : data) {
                Row row = sheet.createRow(rowIndex++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(stt++);
                cell0.setCellStyle(centerStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(item.getLabel());
                cell1.setCellStyle(centerStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getDoanhThu());
                cell2.setCellStyle(currencyStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getSoDonHang());
                cell3.setCellStyle(numberStyle);

                tongDoanhThu += item.getDoanhThu();
                tongDonHang += item.getSoDonHang();
            }

            // Dòng Tổng kết bảng
            Row totalRow = sheet.createRow(rowIndex++);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);
            // Merge STT và Thời gian cho chữ Tổng cộng
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 1));
            // Set style cho ô bị merge để có viền
            totalRow.createCell(1).setCellStyle(headerStyle);

            Cell totalCell2 = totalRow.createCell(2);
            totalCell2.setCellValue(tongDoanhThu);
            totalCell2.setCellStyle(createTotalCurrencyStyle(workbook));

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongDonHang);
            totalCell3.setCellStyle(createTotalNumberStyle(workbook));

            // --- PHẦN FOOTER (KÝ TÊN) ---
            rowIndex += 2; // Cách 2 dòng
            createSignatureSection(sheet, rowIndex, 3); // Chữ ký nằm ở cột cuối (index 3)

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                // Thêm chút padding
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    // ==========================================
    // 2. XUẤT BÁO CÁO TOP SẢN PHẨM
    // ==========================================
    @Override
    public byte[] exportTopSanPham(List<TopSanPhamResponse> data, int limit) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Top sản phẩm bán chạy");

            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle subTitleStyle = createSubTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle numberStyle = createNumberStyle(workbook);
            CellStyle centerStyle = createCenterStyle(workbook);

            int rowIndex = 0;

            // Header Info
            sheet.createRow(rowIndex++).createCell(0).setCellValue("PERFUME BOUTIQUE");

            rowIndex++;
            Row titleRow = sheet.createRow(rowIndex++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BÁO CÁO TOP " + limit + " SẢN PHẨM BÁN CHẠY");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

            Row dateRow = sheet.createRow(rowIndex++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Ngày xuất báo cáo: " + LocalDate.now().format(DATE_FORMATTER));
            dateCell.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

            rowIndex++;

            // Table Header
            Row headerRow = sheet.createRow(rowIndex++);
            String[] headers = {"Hạng", "Mã SP", "Tên sản phẩm", "Số lượng bán", "Doanh thu (VNĐ)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Table Data
            int stt = 1;
            long tongSoLuong = 0;
            double tongDoanhThu = 0;

            for (TopSanPhamResponse item : data) {
                Row row = sheet.createRow(rowIndex++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(stt++);
                cell0.setCellStyle(centerStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(item.getSanPhamId());
                cell1.setCellStyle(centerStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getTenSanPham());
                setBorder(cell2.getCellStyle()); // Helper set border nếu cần hoặc dùng style riêng
                // Tạm dùng default style + border thủ công hoặc tạo textLeftStyle
                CellStyle textStyle = workbook.createCellStyle();
                setBorder(textStyle);
                cell2.setCellStyle(textStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getSoLuongBan());
                cell3.setCellStyle(numberStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(item.getDoanhThu());
                cell4.setCellStyle(currencyStyle);

                tongSoLuong += item.getSoLuongBan();
                tongDoanhThu += item.getDoanhThu();
            }

            // Table Footer
            Row totalRow = sheet.createRow(rowIndex++);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));
            totalRow.createCell(1).setCellStyle(headerStyle);
            totalRow.createCell(2).setCellStyle(headerStyle);

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongSoLuong);
            totalCell3.setCellStyle(createTotalNumberStyle(workbook));

            Cell totalCell4 = totalRow.createCell(4);
            totalCell4.setCellValue(tongDoanhThu);
            totalCell4.setCellStyle(createTotalCurrencyStyle(workbook));

            // Signature
            rowIndex += 2;
            createSignatureSection(sheet, rowIndex, 4);

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    // ==========================================
    // 3. XUẤT BÁO CÁO TRẠNG THÁI ĐƠN HÀNG
    // ==========================================
    @Override
    public byte[] exportThongKeTrangThai(List<ThongKeTrangThaiDonHangResponse> data) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Thống kê trạng thái");

            // Styles
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle subTitleStyle = createSubTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle numberStyle = createNumberStyle(workbook);
            CellStyle centerStyle = createCenterStyle(workbook);

            int rowIndex = 0;

            // Report Header
            sheet.createRow(rowIndex++).createCell(0).setCellValue("PERFUME BOUTIQUE");

            rowIndex++;
            Row titleRow = sheet.createRow(rowIndex++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BÁO CÁO TÌNH TRẠNG ĐƠN HÀNG");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 3));

            Row dateRow = sheet.createRow(rowIndex++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Ngày xuất báo cáo: " + LocalDate.now().format(DATE_FORMATTER));
            dateCell.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 3));

            rowIndex++;

            // Table Header
            Row headerRow = sheet.createRow(rowIndex++);
            String[] headers = {"STT", "Trạng thái", "Số đơn hàng", "Tổng tiền (VNĐ)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int stt = 1;
            long tongSoDonHang = 0;
            double tongTien = 0;

            for (ThongKeTrangThaiDonHangResponse item : data) {
                Row row = sheet.createRow(rowIndex++);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(stt++);
                cell0.setCellStyle(centerStyle);

                Cell cell1 = row.createCell(1);
                String trangThaiText = switch(item.getTrangThai()) {
                    case CHUA_DUOC_GIAO -> "Chưa được giao";
                    case DA_GIAO -> "Đã giao";
                    case DA_HUY -> "Đã hủy";
                };
                cell1.setCellValue(trangThaiText);
                CellStyle textStyle = workbook.createCellStyle();
                setBorder(textStyle);
                cell1.setCellStyle(textStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(item.getSoDonHang());
                cell2.setCellStyle(numberStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(item.getTongTien());
                cell3.setCellStyle(currencyStyle);

                tongSoDonHang += item.getSoDonHang();
                tongTien += item.getTongTien();
            }

            // Total
            Row totalRow = sheet.createRow(rowIndex++);
            Cell totalCell0 = totalRow.createCell(0);
            totalCell0.setCellValue("TỔNG CỘNG");
            totalCell0.setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 1));
            totalRow.createCell(1).setCellStyle(headerStyle);

            Cell totalCell2 = totalRow.createCell(2);
            totalCell2.setCellValue(tongSoDonHang);
            totalCell2.setCellStyle(createTotalNumberStyle(workbook));

            Cell totalCell3 = totalRow.createCell(3);
            totalCell3.setCellValue(tongTien);
            totalCell3.setCellStyle(createTotalCurrencyStyle(workbook));

            // Signature
            rowIndex += 2;
            createSignatureSection(sheet, rowIndex, 3);

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    // ==========================================
    // HELPERS: STYLES & LAYOUT
    // ==========================================

    // Helper tạo phần ký tên
    private void createSignatureSection(Sheet sheet, int rowIndex, int colIndex) {
        Row rowTitle = sheet.createRow(rowIndex);
        Cell cellTitle = rowTitle.createCell(colIndex);
        cellTitle.setCellValue("Người lập báo cáo");

        // Style in đậm, căn giữa
        CellStyle style = sheet.getWorkbook().createCellStyle();
        Font font = sheet.getWorkbook().createFont();
        font.setBold(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        cellTitle.setCellStyle(style);

        Row rowSign = sheet.createRow(rowIndex + 1);
        Cell cellSign = rowSign.createCell(colIndex);
        cellSign.setCellValue("(Ký, họ tên)");

        // Style in nghiêng, căn giữa
        CellStyle styleItalic = sheet.getWorkbook().createCellStyle();
        Font fontItalic = sheet.getWorkbook().createFont();
        fontItalic.setItalic(true);
        styleItalic.setFont(fontItalic);
        styleItalic.setAlignment(HorizontalAlignment.CENTER);
        cellSign.setCellStyle(styleItalic);
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16); // Chữ to 16
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createSubTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setItalic(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
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

    private CellStyle createCenterStyle(Workbook workbook) {
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

    private void setBorder(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }
}