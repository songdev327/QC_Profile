const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// ... bodyParser, cors, controller อื่น ๆ

app.post("/save-machine-log", (req, res) => {
  const { machine, status } = req.body;

  if (!machine || !status) {
    return res.status(400).json({ error: "Missing machine or status" });
  }

  const timestamp = new Date().toISOString();
  const csvLine = `${timestamp},${machine},${status}\n`;

 const logFilePath = path.join(__dirname, "..", "..", "web", "app", "public", "machine_log.csv");

  // เขียน header ถ้ายังไม่มีไฟล์
  if (!fs.existsSync(logFilePath)) {
    const header = "Timestamp,Machine,Status\n";
    fs.writeFileSync(logFilePath, header);
  }

  fs.appendFile(logFilePath, csvLine, (err) => {
    if (err) {
      console.error("❌ Error writing CSV:", err);
      return res.status(500).json({ error: "Failed to save log" });
    }

    console.log(`✅ Logged: ${machine}, ${status}`);
    return res.json({ success: true });
  });
});

app.post("/remove-last-machine-log", (req, res) => {
  const { machine, status } = req.body;

  const logFilePath = path.join(__dirname, "..", "..", "web", "app", "public", "machine_log.csv");

  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ error: "CSV not found" });
  }

  const lines = fs.readFileSync(logFilePath, "utf-8").trim().split("\n");

  // 🔍 หาบรรทัดสุดท้ายที่ตรงกับ machine+status แล้วลบออก
  const reversedLines = lines.slice().reverse();
  const indexToRemove = reversedLines.findIndex(line => line.includes(`,${machine},${status}`));

  if (indexToRemove === -1) {
    return res.status(404).json({ error: "Log not found" });
  }

  // ลบบรรทัดนั้น
  const originalIndex = lines.length - 1 - indexToRemove;
  lines.splice(originalIndex, 1);

  fs.writeFileSync(logFilePath, lines.join("\n") + "\n");

  return res.json({ success: true });
});

module.exports = app;