const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const path = require("path"); // ✅ ต้องเปิดใช้ path ด้วย

const io = new Server(http, {
  cors: {
    origin: [
      "http://10.120.123.25:3000",     // ✅ อนุญาต IP ภายนอก
      "http://192.168.96.124:3000"     // ✅ IP Server ตัวเอง (ใช้ตอนเปิดผ่าน browser)
    ],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

app.set("socketio", io);

// ✅ CORS (อนุญาตเฉพาะ IP ที่ต้องการ)
const corsOptions = {
  origin: [
    "http://10.120.123.25:3000",
    "http://192.168.96.124:3000"
  ],
  credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploadproduction", express.static("uploadproduction"));

// ✅ Serve React Build Files
app.use(express.static(path.join(__dirname, "../web/app/build")));

// ✅ Routes API
app.use(require('./controllers/PackageController'));
app.use(require('./controllers/MemberController'));
app.use(require('./controllers/ProductController'));
app.use(require('./controllers/MachineController'));
app.use(require('./controllers/MachineShaftController'));
app.use(require('./controllers/PartnameController'));
app.use(require('./controllers/PartnameShaftController'));
app.use(require('./controllers/ProductImageController'));
app.use(require('./controllers/ProcessController'));

app.use(require('./controllers/MasterSpecQcLineController'));
app.use(require('./controllers/QcLineInputSpecController'));

app.use(require('./controllers/MasterToolNumberController'));
app.use(require('./controllers/MasterToolNumberSpecController'));
app.use(require('./controllers/MasterToolNumberSleeveController'));
app.use(require('./controllers/MasterToolNumberSpecSleeveController'));

app.use(require('./controllers/ProductInputSpecController'));

app.use(require('./controllers/MasterToolNumberCSController'));
app.use(require('./controllers/MasterToolNumberSpecCSController'));

app.use(require('./controllers/MasterToolNumberSBController'));
app.use(require('./controllers/MasterToolNumberSpecSBController'));

app.use(require('./controllers/MasterToolNumberTNController'));
app.use(require('./controllers/MasterToolNumberSpecTNController'));

app.use(require('./controllers/MasterToolNumberTBMController'));
app.use(require('./controllers/MasterToolNumberSpecTBMController'));

app.use(require('./controllers/MasterToolNumberTTCController'));
app.use(require('./controllers/MasterToolNumberSpecTTCController'));

app.use(require('./controllers/MasterToolNumberTBController'));
app.use(require('./controllers/MasterToolNumberSpecTBController'));

app.use(require('./controllers/MasterToolNumberTCHController'));
app.use(require('./controllers/MasterToolNumberSpecTCHController'));

app.use(require('./controllers/TestPatelietController'));


app.use(require('./controllers/AdminController'));
app.use(require('./controllers/AdminSelectController'));
app.use(require("./controllers/SleeveRWD1Controller"));


// ✅ Fallback: React SPA (ทุก route ที่ไม่ตรง API → ส่ง index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/app/build/index.html"));
});

// ✅ Start Server (ฟังบนทุก IP)
http.listen(3000, "0.0.0.0", () => {
  console.log("✅ Server is running on http://0.0.0.0:3000");
});
