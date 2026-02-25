// const express = require('express')
// var cors = require('cors')
// const app = express()
// const port = 3000
// const bodyParser = require('body-parser');


const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const http = require("http").createServer(app);
const { Server } = require("socket.io");


const io = new Server(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

app.set("socketio", io); // 💡 สำคัญมาก


const corsOptions = {
  origin: "http://localhost:3001",  // ✅ ให้ frontend เรียกได้
  credentials: true
};
app.use(cors(corsOptions));

//---- Start ใช้สำหรับ Run Build ---------------------------------------------------

// const path = require("path");

//---- End ใช้สำหรับ Run Build ---------------------------------------------------

// app.use(cors()); // Dev

//---- Start ใช้สำหรับ Run Build ---------------------------------------------------

// const corsOptions = {
//   origin: [
//     'http://localhost:3000',           // local dev
//     'http://10.120.123.25:3000',       // IP ที่คุณต้องการอนุญาต
//     'http://192.168.96.124:3000'       // ปัจจุบันที่คุณใช้
//   ],
//   credentials: true
// };
// app.use(cors(corsOptions));

//---- End ใช้สำหรับ Run Build ---------------------------------------------------

app.use(require("./controllers/MasterToolNumberSpecCHExcelController"));
app.use(require("./controllers/MasterToolNumberSpecCSExcelController"));
app.use(require("./controllers/MasterToolNumberSpecSBExcelController"));
app.use(require("./controllers/MasterToolNumberSpecTNExcelController"));

app.use(require("./controllers/MasterToolNumberSpecTBSExcelController"));
app.use(require("./controllers/MasterToolNumberSpecTBMExcelController"));
app.use(require("./controllers/MasterToolNumberSpecTTCExcelController"));
app.use(require("./controllers/MasterToolNumberSpecTBExcelController"));
app.use(require("./controllers/MasterToolNumberSpecTCHExcelController"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploadproduction", express.static("uploadproduction"));


//---- Start ใช้สำหรับ Run Build ---------------------------------------------------

// app.use(express.static(path.join(__dirname, "../web/app/build")));

//---- End ใช้สำหรับ Run Build ---------------------------------------------------



//const PackageController = require('./controllers/PackageController');
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

// app.use(require('./controllers/LogMachineController'));

//------- Start Run Builde fallback all unmatched routes to React index.html

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../web/app/build/index.html"));
// });

// app.listen(port, '0.0.0.0', () => {
//   console.log(`✅ Server is running on http://0.0.0.0:${port}`);
// });

//------- End Run Builde fallback all unmatched routes to React index.html

// app.listen(port, () => {
//     console.log(`Example app listening on port `, port);
// })


http.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});