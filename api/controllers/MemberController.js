const express = require("express");
const MemberModel = require("../models/MemberModel");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");
const PackageModel = require("../models/PackageModel");

app.post("/member/signin", async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        process: req.body.process,
        password: req.body.password,
      },
    });
    // console.log(member);

    if (member.length > 0) {
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({ token: token, message: "success" });
    } else {
      res.statusCode = 401;
      res.send({ message: "not found" });
    }
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

// app.post("/member/signin", async (req, res) => {
//   try {
//     const member = await MemberModel.findOne({
//       where: {
//         // username: req.body.username,
//         password: req.body.password,
//       },
//     });

//     if (member) {
//       const token = jwt.sign({ id: member.id }, process.env.secret);
//       res.send({ token: token, message: "success", process: member.process });
//     } else {
//       res.statusCode = 401;
//       res.send({ message: "Pass word not found" });
//     }
//   } catch (e) {
//     res.statusCode = 500;
//     res.send({ message: e.message });
//   }
// });

app.post("/member/signinSetting", async (req, res) => {
  try {
    const member = await MemberModel.findOne({
      where: {
        // username: req.body.username,
        password: req.body.password,
      },
    });

    if (member) {
      const token = jwt.sign({ id: member.id }, process.env.secret);
      res.send({ token: token, message: "success", permissions: member.permissions });
    } else {
      res.statusCode = 401;
      res.send({ message: "Permission not found" });
    }
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/member/signinSettingToProduction", async (req, res) => {
  try {
    // ตรวจสอบว่าค่า process ต้องเป็น "Production"
    if (req.body.process !== "Production") {
      res.status(401).send({ message: "อนุญาตเฉพาะผู้ใช้ Production เท่านั้น" });
      return;
    }

    // ดึงข้อมูลสมาชิกจากฐานข้อมูลตาม process และ password
    const member = await MemberModel.findAll({
      where: {
        process: req.body.process,
        password: req.body.password,
      },
    });

    // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
    if (member.length > 0) {
      // เพิ่มการตรวจสอบสิทธิ์ permissions ต้องเป็น "Admin"
      if (member[0].permissions !== "Admin" && member[0].permissions !== "Leader") {
        res.status(403).send({ message: "คุณไม่มีสิทธิ์ในการเข้าถึง Admin" });
        return;
      }

      // หากการตรวจสอบทั้งหมดผ่าน จะทำการสร้าง JWT Token และส่งกลับพร้อมกับ permissions
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({
        token: token,
        message: "success",
        permissions: member[0].permissions, // ส่งค่า permissions กลับไปด้วย
        name: member[0].name, // ✅ เพิ่ม name ตรงนี้
      });
    } else {
      res.status(401).send({ message: "ไม่พบข้อมูลในระบบ" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/member/signinSettingToPC", async (req, res) => {
  try {
    // ตรวจสอบว่าครบทั้ง 3 เงื่อนไข
    if (
      req.body.process !== "Production" ||
      req.body.typemc !== "PC"
    ) {
      res.status(401).send({ message: "อนุญาตเฉพาะ Production และ PC เท่านั้น" });
      return;
    }

    // ดึงข้อมูลสมาชิกจากฐานข้อมูลตาม process และ password
    const member = await MemberModel.findAll({
      where: {
        process: req.body.process,
        password: req.body.password,
        typemc: req.body.typemc,
        
      },
    });

    // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
    if (member.length > 0) {
      // เพิ่มการตรวจสอบสิทธิ์ permissions ต้องเป็น "Admin"
      if (member[0].permissions !== "Admin") {
        res.status(403).send({ message: "คุณไม่มีสิทธิ์ในการเข้าถึง Admin" });
        return;
      }

      // หากการตรวจสอบทั้งหมดผ่าน จะทำการสร้าง JWT Token และส่งกลับพร้อมกับ permissions
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({
        token: token,
        message: "success",
        permissions: member[0].permissions, // ส่งค่า permissions กลับไปด้วย
      });
    } else {
      res.status(401).send({ message: "ไม่พบข้อมูลในระบบ" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/member/signinSettingToQCEquipment", async (req, res) => {
  try {
    if (req.body.process !== "QC Equipment") {
      res.status(401).send({ message: "อนุญาตเฉพาะผู้ใช้ QC Equipment เท่านั้น" });
      return;
    }

    const member = await MemberModel.findAll({
      where: {
        process: req.body.process,
        password: req.body.password,
      },
    });

    // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
    if (member.length > 0) {
      // เพิ่มการตรวจสอบสิทธิ์ permissions ต้องเป็น "Admin"
      if (member[0].permissions !== "Admin" && member[0].permissions !== "Leader") {
        res.status(403).send({ message: "คุณไม่มีสิทธิ์ในการเข้าถึง Admin" });
        return;
      }

      // หากการตรวจสอบทั้งหมดผ่าน จะทำการสร้าง JWT Token และส่งกลับพร้อมกับ permissions
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({
        token: token,
        message: "success",
        permissions: member[0].permissions, // ส่งค่า permissions กลับไปด้วย
      });
    } else {
      res.status(401).send({ message: "ไม่พบข้อมูลในระบบ" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});



app.get("/member/info", service.isLogin, async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);
    const payload = jwt.decode(service.getToken(req));
    const member = await MemberModel.findByPk(payload.id, {
      attributes: ["id", "name"],
      include: [
        {
          model: PackageModel,
          attributes: ["name"],
        },
      ],
    });
    res.send({ result: member, message: "success" });
  } catch (e) {
    res.statusCode = 500;
    return res.send({ message: e.message });
  }
});

app.put("/member/changeProfile", service.isLogin, async (req, res) => {
  try {
    const memberId = service.getMenberId(req);
    const payload = {
      name: req.body.memberName,
    };
    const result = await MemberModel.update(payload, {
      where: {
        id: memberId,
      },
    });

    res.send({ message: "success", result: result });
  } catch (e) {
    res.statusCode = 500;
    return res.send({ message: e.message });
  }
});

app.get("/user/list", async (req, res) => {
  try {
    const results = await MemberModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/user/listSearch", async (req, res) => {
  try {
    const results = await MemberModel.findAll({
      where: {
        process: "Production",  // กรองเฉพาะผู้ใช้ที่มี process เป็น Production
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/user/listProduction", async (req, res) => {
  try {
    const results = await MemberModel.findAll({
      where: {
        process: "Production",  // กรองเฉพาะผู้ใช้ที่มี process เป็น Production
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/user/listQCEquipment", async (req, res) => {
  try {
    const results = await MemberModel.findAll({
      where: {
        process: "QC Equipment",  // กรองเฉพาะผู้ใช้ที่มี process เป็น Production
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/user/delete/:id", async (req, res) => {
  try {
    await MemberModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/getNameTN", async (req, res) => {
  try {
    const results = await MemberModel.findAll({
      where: { typemc: "TN" },   // ✅ กรองตรงนี้
      attributes: ["name"],      // ✅ ดึงเฉพาะคอลัม name
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});




module.exports = app;
