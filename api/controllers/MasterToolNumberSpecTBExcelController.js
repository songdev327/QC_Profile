const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const MasterToolNumberSpecTBModel = require("../models/MasterToolNumberSpecTBModel");

const app = express();

// ✅ uploads_excel
const UPLOAD_DIR = path.join(process.cwd(), "uploads_excel");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ✅ ใช้ diskStorage + filename ชัดเจน
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

// ✅ ตั้ง limits กันไฟล์ใหญ่/ request ตัดกลางทาง (ปรับได้)
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".xlsx" && ext !== ".xls") {
      return cb(new Error("รองรับเฉพาะไฟล์ .xls และ .xlsx เท่านั้น"));
    }
    cb(null, true);
  },
});

// ====== HEADER CHECK HELPERS ======
const EXCLUDE_DB_COLS = ["id", "createdAt", "updatedAt"];

function normalizeHeader(h) {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseCellValue(val) {
  if (val == null) return null;
  if (typeof val === "object" && val.richText) {
    return val.richText.map((rt) => rt.text).join("").trim();
  }
  return String(val).trim();
}

function getDbHeaders() {
  return Object.keys(MasterToolNumberSpecTBModel.rawAttributes).filter(
    (k) => !EXCLUDE_DB_COLS.includes(k)
  );
}

function diffHeaders(excelHeaders, dbHeaders) {
  const excelNorm = excelHeaders.map(normalizeHeader).filter(Boolean);
  const dbNorm = dbHeaders.map(normalizeHeader).filter(Boolean);

  const missingInExcel = dbNorm.filter((h) => !excelNorm.includes(h));
  const extraInExcel = excelNorm.filter((h) => !dbNorm.includes(h));

  return { missingInExcel, extraInExcel };
}

async function restartIdSequence(sequelize, tableName) {
  try {
    const [rows] = await sequelize.query(
      `SELECT pg_get_serial_sequence('"${tableName}"', 'id') AS seq;`
    );
    const seq = rows?.[0]?.seq;
    if (seq) await sequelize.query(`ALTER SEQUENCE ${seq} RESTART WITH 1;`);
  } catch (_) {}
}

// ✅ จุดสำคัญ: ห่อ upload.single ด้วย callback เพื่อ catch busboy/multer error
app.post("/upload-master-tool-spec-tb", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    // ✅ จับ error multer/busboy ที่ทำให้ขึ้น Unexpected end of form
    if (err) {
      return res.status(400).json({
        message: `Upload error: ${err.message || "Unexpected end of form"}`,
      });
    }

    const filePath = req.file?.path;
    const ext = path.extname(req.file?.originalname || "").toLowerCase();

    try {
      if (!filePath) {
        return res.status(400).json({ message: "⚠️ ไม่พบไฟล์ที่อัปโหลด (field ต้องชื่อ file)" });
      }

      const dbHeaders = getDbHeaders();
      let excelHeaders = [];
      let rows = [];

      // =======================
      // ✅ .xlsx
      // =======================
      if (ext === ".xlsx") {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const headerRow = sheet.getRow(1);
        for (let c = 1; c <= headerRow.cellCount; c++) {
          excelHeaders.push(parseCellValue(headerRow.getCell(c).value));
        }

        const { missingInExcel, extraInExcel } = diffHeaders(excelHeaders, dbHeaders);
        if (missingInExcel.length || extraInExcel.length) {
          return res.status(400).json({
            message: "⚠️ หัวตารางในไฟล์ Excel ไม่ตรงกับหัวตารางในฐานข้อมูล (MASTER TOOL TB)",
            details: {
              expected: dbHeaders,
              found: excelHeaders,
              missingInExcel,
              extraInExcel,
              ignoreDbColumns: EXCLUDE_DB_COLS,
            },
          });
        }

        const headerMap = {};
        for (let c = 1; c <= headerRow.cellCount; c++) {
          const key = normalizeHeader(parseCellValue(headerRow.getCell(c).value));
          if (key) headerMap[key] = c;
        }

        const getCellByHeader = (row, headerName) => {
          const idx = headerMap[normalizeHeader(headerName)];
          return idx ? row.getCell(idx) : null;
        };

        const parseBigInt = (cell) => {
          const v = parseCellValue(cell?.value);
          if (v == null || v === "") return null;
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        };

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;

          rows.push({
            Machine_Number: parseCellValue(getCellByHeader(row, "Machine_Number")?.value),
            Partname_Model: parseCellValue(getCellByHeader(row, "Partname_Model")?.value),
            process: parseCellValue(getCellByHeader(row, "process")?.value),
            tool_no: parseCellValue(getCellByHeader(row, "tool_no")?.value),
            section_check: parseCellValue(getCellByHeader(row, "section_check")?.value),
            spec_tool_no: parseCellValue(getCellByHeader(row, "spec_tool_no")?.value),
            pass: parseCellValue(getCellByHeader(row, "pass")?.value),
            reject: parseCellValue(getCellByHeader(row, "reject")?.value),
            rev_control: parseCellValue(getCellByHeader(row, "rev_control")?.value),
            part_no: parseCellValue(getCellByHeader(row, "part_no")?.value),
            password_input: parseCellValue(getCellByHeader(row, "password_input")?.value),
            spec_center: parseCellValue(getCellByHeader(row, "spec_center")?.value),
            date_control: parseCellValue(getCellByHeader(row, "date_control")?.value),
            div_control: parseCellValue(getCellByHeader(row, "div_control")?.value),
            sequence_number_spec: parseBigInt(getCellByHeader(row, "sequence_number_spec")),
            mesering_type: parseCellValue(getCellByHeader(row, "mesering_type")?.value),
          });
        });
      }

      // =======================
      // ✅ .xls
      // =======================
      if (ext === ".xls") {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];

        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        excelHeaders = (aoa[0] || []).map((h) => String(h).trim());

        const { missingInExcel, extraInExcel } = diffHeaders(excelHeaders, dbHeaders);
        if (missingInExcel.length || extraInExcel.length) {
          return res.status(400).json({
            message: "⚠️ หัวตารางในไฟล์ Excel ไม่ตรงกับหัวตารางในฐานข้อมูล (MASTER TOOL TB)",
            details: {
              expected: dbHeaders,
              found: excelHeaders,
              missingInExcel,
              extraInExcel,
              ignoreDbColumns: EXCLUDE_DB_COLS,
            },
          });
        }

        const data = XLSX.utils.sheet_to_json(ws, { defval: null });
        rows = data.map((r) => ({
          Machine_Number: r["Machine_Number"] ?? null,
          Partname_Model: r["Partname_Model"] ?? null,
          process: r["process"] ?? null,
          tool_no: r["tool_no"] ?? null,
          section_check: r["section_check"] ?? null,
          spec_tool_no: r["spec_tool_no"] ?? null,
          pass: r["pass"] ?? null,
          reject: r["reject"] ?? null,
          rev_control: r["rev_control"] ?? null,
          part_no: r["part_no"] ?? null,
          password_input: r["password_input"] ?? null,
          spec_center: r["spec_center"] ?? null,
          date_control: r["date_control"] ?? null,
          div_control: r["div_control"] ?? null,
          sequence_number_spec: r["sequence_number_spec"] != null ? Number(r["sequence_number_spec"]) : null,
          mesering_type: r["mesering_type"] ?? null,
        }));
      }

      if (!rows.length) {
        return res.status(400).json({ message: "⚠️ ไม่มีข้อมูลในไฟล์ Excel" });
      }

      await MasterToolNumberSpecTBModel.destroy({ where: {} });

      await restartIdSequence(
        MasterToolNumberSpecTBModel.sequelize,
        MasterToolNumberSpecTBModel.getTableName()
      );

      await MasterToolNumberSpecTBModel.bulkCreate(rows);

      return res.status(200).json({
        message: `✅ นำเข้า MASTER TOOL TB สำเร็จ (${rows.length} แถว)`,
      });
    } catch (error) {
      console.error("❌ Error importing MasterTool TB:", error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการนำเข้า Excel" });
    } finally {
      if (filePath) {
        try { await fsp.unlink(filePath); } catch (_) {}
      }
    }
  });
});

module.exports = app;
