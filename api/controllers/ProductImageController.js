const express = require("express");
const app = express();
const ProductImageModel = require("../models/ProductImageModel");
const SleeveRWD1ImageModel = require("../models/SleeveRWD1Model");

const AddPdfMachineCSAllModel = require("../models/AddPdfMachineCSAllModel");
const AddPdfMachineSBAllModel = require("../models/AddPdfMachineSBAllModel");
const AddPdfMachineTNAllModel = require("../models/AddPdfMachineTNAllModel");
const AddPdfMachineCHAllModel = require("../models/AddPdfMachineCHAllModel");

const AddPdfMachineTBSAllModel = require("../models/AddPdfMachineTBSAllModel");
const AddPdfMachineTBMAllModel = require("../models/AddPdfMachineTBMAllModel");
const AddPdfMachineTTCAllModel = require("../models/AddPdfMachineTTCAllModel");
const AddPdfMachineTBAllModel = require("../models/AddPdfMachineTBAllModel");
const AddPdfMachineTCHAllModel = require("../models/AddPdfMachineTCHAllModel");




const Service = require("./Service");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const ProductModel = require("../models/ProductModel");


// ----------------- Start PDF All ------------------------------------------------
app.use(fileUpload());
app.post("/productImage/insert", Service.isLogin, async (req, res) => {
  try {
    // return res.send('ok')// Test ดูค่า
    //  const { status,mesering } = req.body
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    // const productImage = req.body.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploads/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await ProductImageModel.create({
        isMain: false,
        imageName: fullNewName,
        imageName1: fullNewName,
        productId: req.body.productId,
        status: req.body.status, 
        mesering: req.body.mesering, 
        afterset: req.body.afterset, 
        barcode: req.body.barcode, 
        name: req.body.name, 
        shift: req.body.shift, 
        machine: req.body.machine, 
        model: req.body.model, 
        process: req.body.process, 
        nameeqm: req.body.nameeqm, 
        dateeqm: req.body.dateeqm, 
        timeeqm: req.body.timeeqm, 
        afterset: req.body.afterset,
        nameafterset: req.body.nameafterset,
      });
      // res.send({ productImage: productImage, uploadPath: uploadPath}); // Test ดูค่า
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/productImage/insertImageProjector", Service.isLogin, async (req, res) => {
  try {
    // return res.send('ok')// Test ดูค่า
    //  const { status,mesering } = req.body
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    // const productImage = req.body.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploads/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await ProductImageModel.create({
        isMain: false,
        imageName: fullNewName,
        imageName1: fullNewName,
        productId: req.body.productId,
        afterset: req.body.afterset, // ใช้ req.body.mesering แทน mesering
        barcode: req.body.barcode, // ใช้ req.body.mesering แทน mesering
        name: req.body.name, // ใช้ req.body.mesering แทน mesering
        shift: req.body.shift, // ใช้ req.body.mesering แทน mesering
        machine: req.body.machine, // ใช้ req.body.mesering แทน mesering
        model: req.body.model, // ใช้ req.body.mesering แทน mesering
        process: req.body.process, // ใช้ req.body.mesering แทน mesering
        afterset: req.body.afterset,
        projector_type: req.body.projector_type,
        projector_status: req.body.projector_status,

      });
      // res.send({ productImage: productImage, uploadPath: uploadPath}); // Test ดูค่า
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});


// app.use(fileUpload());
app.delete("/productImage/delete/:id", Service.isLogin, async (req, res) => {
  try {
    const row = await ProductImageModel.findByPk(req.params.id);
    const imageName = row.imageName;

    await ProductImageModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    fs.unlinkSync("uploads/" + imageName);

    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/list/:productId", Service.isLogin, async (req, res) => {
  try {
    const results = await ProductImageModel.findAll({
      where: {
        productId: req.params.productId,
      },
      order: [["id", "DESC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get("/productImage/listProjector/:productId", Service.isLogin, async (req, res) => {
  try {
    const results = await ProductImageModel.findAll({
      where: {
        productId: req.params.productId,
      },
      order: [["id", "DESC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get(
  "/productImage/mesering/:productId",
  Service.isLogin,
  async (req, res) => {
    try {
      ProductModel.hasMany(ProductImageModel);

      const results = await ProductImageModel.findAll({
        where: {
          productId: req.params.productId,
        },
        order: [["id", "DESC"]],
      });
      res.send({ message: "success", results: results });
    } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
    }
  }
);

// ----------------- End PDF All ------------------------------------------------

// ----------------- Start PDF RWD1 ------------------------------------------------
app.post("/productImage/insertRWD1", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploads/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await SleeveRWD1ImageModel.create({
        isMain: false,
        imageName: fullNewName,
        toolnumber: req.body.toolnumber,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllRWD1", async (req, res) => {
  try {
    const results = await SleeveRWD1ImageModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete(
  "/productImage/deleteRWD1/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await SleeveRWD1ImageModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await SleeveRWD1ImageModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploads/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

// ----------------- End PDF RWD1 ------------------------------------------------


// ----------------- Start PDF All Model CS Machine ------------------------------------------------
app.post("/productImage/insertAllModelCSMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineCSAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelCSMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineCSAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateCSImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineCSAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberCS", async (req, res) => {
  let result = await AddPdfMachineCSAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelCSMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineCSAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineCSAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchCS", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineCSAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelCSMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineCSAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineCSAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// ----------------- End PDF All Model CS Machine ------------------------------------------------

// ----------------- Start PDF All Model SB Machine ------------------------------------------------
app.post("/productImage/insertAllModelSBMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineSBAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelSBMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineSBAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateSBImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineSBAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberSB", async (req, res) => {
  let result = await AddPdfMachineSBAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelSBMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineSBAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineSBAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchSB", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineSBAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelSBMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineSBAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineSBAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model SB Machine ------------------------------------------------

// ----------------- Start PDF All Model TN Machine ------------------------------------------------
app.post("/productImage/insertAllModelTNMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTNAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTNMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTNAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTNImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTNAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTN", async (req, res) => {
  let result = await AddPdfMachineTNAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTNMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTNAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTNAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTN", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTNAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTNMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTNAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTNAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TN Machine ------------------------------------------------

// ----------------- Start PDF All Model CH Machine ------------------------------------------------
app.post("/productImage/insertAllModelCHMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineCHAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelCHMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineCHAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateCHImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineCHAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberCH", async (req, res) => {
  let result = await AddPdfMachineCHAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelCHMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineCHAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineCHAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchCH", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineCHAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelCHMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineCHAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineCHAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// ----------------- End PDF All Model CH Machine ------------------------------------------------

// ----------------- Start PDF All Model TBS Machine ------------------------------------------------
app.post("/productImage/insertAllModelTBSMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTBSAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTBSMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTBSAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTBSImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTBSAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTBS", async (req, res) => {
  let result = await AddPdfMachineTBSAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTBSMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTBSAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTBSAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTBS", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTBSAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTBSMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTBSAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTBSAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TBS Machine ------------------------------------------------

// ----------------- Start PDF All Model TBM Machine ------------------------------------------------
app.post("/productImage/insertAllModelTBMMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTBMAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTBMMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTBMAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTBMImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTBMAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTBM", async (req, res) => {
  let result = await AddPdfMachineTBMAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTBMMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTBMAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTBMAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTBM", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTBMAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTBMMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTBMAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTBMAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TBM Machine ------------------------------------------------

// ----------------- Start PDF All Model TTC Machine ------------------------------------------------
app.post("/productImage/insertAllModelTTCMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTTCAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTTCMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTTCAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTTCImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTTCAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTTC", async (req, res) => {
  let result = await AddPdfMachineTTCAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTTCMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTTCAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTTCAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTTC", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTTCAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTTCMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTTCAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTTCAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TTC Machine ------------------------------------------------

// ----------------- Start PDF All Model TCH Machine ------------------------------------------------
app.post("/productImage/insertAllModelTBMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTBAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTBMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTBAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTBImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTBAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTB", async (req, res) => {
  let result = await AddPdfMachineTTCAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTBMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTBAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTBAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTB", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTBAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTBMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTBAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTBAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TB Machine ------------------------------------------------

// ----------------- Start PDF All Model TCH Machine ------------------------------------------------
app.post("/productImage/insertAllModelTCHMachine", Service.isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const productImage = req.files.productImage;
    const random = Math.random() * 1000;
    const newName =
      y +
      "-" +
      m +
      "-" +
      d +
      "-" +
      h +
      "-" +
      mm +
      "-" +
      s +
      "-" +
      ms +
      "-" +
      random;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = newName + "." + ext;
    const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      res.send({ message: "success" });

      await AddPdfMachineTCHAllModel.create({
        isMain: false,
        imageName: fullNewName,
        process: req.body.process,
        model: req.body.model,
        toolnumber: req.body.toolnumber,
        machine_type: req.body.machine_type,
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/productImage/getAllModelTCHMachine", async (req, res) => {
  try {
    const results = await AddPdfMachineTCHAllModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getUpdateTCHImage/:id", async (req, res) => {
  try {
    const { id } = req.params; // ดึง ID จาก URL พารามิเตอร์
    const result = await AddPdfMachineTCHAllModel.findOne({
      where: { id: id }, // กรองด้วย id ที่ได้รับ
    });

    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.status(404).send({ message: "PDF not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/productImage/getToolNumberTCH", async (req, res) => {
  let result = await AddPdfMachineTCHAllModel.findAll(
    {
      order: ["toolnumber"],
    }
  );

  return res.json({ result });
});

app.delete(
  "/productImage/deleteAllModelTCHMachine/:id",
  Service.isLogin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }

    try {
      const row = await AddPdfMachineTCHAllModel.findByPk(id);
      if (!row) {
        res.status(404).send({ message: "Image not found" });
        return;
      }

      const imageName = row.imageName;

      await AddPdfMachineTCHAllModel.destroy({
        where: {
          id: id,
        },
      });

      fs.unlinkSync("uploadproduction/" + imageName);

      res.send({ message: "success" });
    } catch (e) {
      console.error("Error deleting image:", e);
      res.status(500).send({ message: e.message });
    }
  }
);

app.post("/productImage/searchTCH", async (req, res) => {
  const { process, model, machine_type } = req.body;

  try {
    // ดึงข้อมูลที่ตรงกับ process และ model
    const results = await AddPdfMachineTCHAllModel.findAll({
      where: {
        process: process || "",   // ใช้เงื่อนไข process
        model: model || "",       // ใช้เงื่อนไข model
        machine_type: machine_type || "",       // ใช้เงื่อนไข machine_type
      },
      order: [["id", "ASC"]],
    });

    // ส่งผลลัพธ์กลับไปยังฝั่งไคลเอนต์
    if (results.length > 0) {
      res.send({ message: "success", results: results });
    } else {
      res.send({ message: "no results", results: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/productImage/updateAllModelTCHMachine/:id", Service.isLogin, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีไฟล์ productImage หรือไม่
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const random = Math.random() * 1000;
      const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = `${newName}.${ext}`;
      const uploadPath = __dirname + "/../uploadproduction/" + fullNewName;

      // ย้ายไฟล์ที่ถูกอัปโหลดไปยังโฟลเดอร์ที่ต้องการ
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);

        // อัปเดตข้อมูลพร้อมกับชื่อไฟล์ใหม่
        await AddPdfMachineTCHAllModel.update(
          {
            isMain: false,
            imageName: fullNewName,
            process: req.body.process,
            model: req.body.model,
            toolnumber: req.body.toolnumber,
            machine_type: req.body.machine_type,
          },
          { where: { id: id } }
        );

        res.send({ message: "success" });
      });
    } else {
      // ถ้าไม่มีไฟล์ที่ถูกอัปโหลดใหม่, อัปเดตเฉพาะข้อมูลอื่น ๆ
      await AddPdfMachineTCHAllModel.update(
        {
          process: req.body.process,
          model: req.body.model,
          toolnumber: req.body.toolnumber,
          machine_type: req.body.machine_type,
        },
        { where: { id: id } }
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
// ----------------- End PDF All Model TCH Machine ------------------------------------------------


// --------------- Start Pdf Inspection QC Sleeve ---------------------------------------------------------------
app.post("/productImageInspection/insert", Service.isLogin, async (req, res) => {
    try {
      // return res.send('ok')// Test ดูค่า
      //  const { status,mesering } = req.body
      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const productImage = req.files.productImage;
      // const productImage = req.body.productImage;
      const random = Math.random() * 1000;
      const newName =
        y +
        "-" +
        m +
        "-" +
        d +
        "-" +
        h +
        "-" +
        mm +
        "-" +
        s +
        "-" +
        ms +
        "-" +
        random;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = newName + "." + ext;
      const uploadPath = __dirname + "/../uploads/" + fullNewName;
  
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);
        res.send({ message: "success" });
  
        await InspectionImageModel.create({
          isMain: false,
          imageName: fullNewName,
          imageName1: fullNewName,
          productId: req.body.productId,
          status: req.body.status, 
          mesering: req.body.mesering, 
          afterset: req.body.afterset, 
          barcode: req.body.barcode, 
          name: req.body.setter_by_pro,
          machine: req.body.machine,
          model: req.body.new_model, 
          process: req.body.process, 
          nameeqm: req.body.nameeqm, 
          dateeqm: req.body.dateeqm, 
          timeeqm: req.body.timeeqm, 
          afterset: req.body.afterset,
          nameafterset: req.body.nameafterset,
        });
        // res.send({ productImage: productImage, uploadPath: uploadPath}); // Test ดูค่า
      });
    } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
    }
  });


  app.get(
    "/productImageInspectionGet/mesering/:productId",
    Service.isLogin,
    async (req, res) => {
      try {
        InspectionModel.hasMany(InspectionImageModel, {
          foreignKey: 'productId', // ชื่อคอลัมน์ที่อยู่ในตาราง inspection_images
          sourceKey: 'id',         // ชื่อคอลัมน์ Primary key ของตาราง inspection
        });
  
        const results = await InspectionImageModel.findAll({
          where: {
            productId: req.params.productId,
          },
          order: [["id", "DESC"]],
        });
        res.send({ message: "success", results: results });
      } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
      }
    }
  );

  app.delete("/productImageInspection/delete/:id", Service.isLogin, async (req, res) => {
    try {
      const row = await InspectionImageModel.findByPk(req.params.id);
      const imageName = row.imageName;
  
      await InspectionImageModel.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      fs.unlinkSync("uploads/" + imageName);
  
      res.send({ message: "success" });
    } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
    }
  });

 // --------------- End Pdf Inspection QC Sleeve ------------------------------------------------------------


 // --------------- Start Pdf Inspection QC Shaft ---------------------------------------------------------------
  app.post("/productImageInspection/insertShaft", Service.isLogin, async (req, res) => {
    try {
      // return res.send('ok')// Test ดูค่า
      //  const { status,mesering } = req.body
      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mm = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();
      const productImage = req.files.productImage;
      // const productImage = req.body.productImage;
      const random = Math.random() * 1000;
      const newName =
        y +
        "-" +
        m +
        "-" +
        d +
        "-" +
        h +
        "-" +
        mm +
        "-" +
        s +
        "-" +
        ms +
        "-" +
        random;
      const arr = productImage.name.split(".");
      const ext = arr[arr.length - 1];
      const fullNewName = newName + "." + ext;
      const uploadPath = __dirname + "/../uploads/" + fullNewName;
  
      await productImage.mv(uploadPath, async (err) => {
        if (err) throw new Error(err);
        res.send({ message: "success" });
  
        await InspectionImageShaftModel.create({
          isMain: false,
          imageName: fullNewName,
          imageName1: fullNewName,
          productId: req.body.productId,
          status: req.body.status, 
          mesering: req.body.mesering, 
          afterset: req.body.afterset, 
          barcode: req.body.barcode, 
          name: req.body.setter_by_pro,
          machine: req.body.machine,
          model: req.body.new_model, 
          process: req.body.process, 
          nameeqm: req.body.nameeqm, 
          dateeqm: req.body.dateeqm, 
          timeeqm: req.body.timeeqm, 
          afterset: req.body.afterset,
          nameafterset: req.body.nameafterset,
        });
        // res.send({ productImage: productImage, uploadPath: uploadPath}); // Test ดูค่า
      });
    } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
    }
  });


  app.get(
    "/productImageInspectionGet/meseringShaft/:productId",
    Service.isLogin,
    async (req, res) => {
      try {
        InspectionShaftModel.hasMany(InspectionImageShaftModel, {
          foreignKey: 'productId', // ชื่อคอลัมน์ที่อยู่ในตาราง inspection_images
          sourceKey: 'id',         // ชื่อคอลัมน์ Primary key ของตาราง inspection
        });
  
        const results = await InspectionImageShaftModel.findAll({
          where: {
            productId: req.params.productId,
          },
          order: [["id", "DESC"]],
        });
        res.send({ message: "success", results: results });
      } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
      }
    }
  );

  app.delete("/productImageInspection/deleteShaft/:id", Service.isLogin, async (req, res) => {
    try {
      const row = await InspectionImageShaftModel.findByPk(req.params.id);
      const imageName = row.imageName;
  
      await InspectionImageShaftModel.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      fs.unlinkSync("uploads/" + imageName);
  
      res.send({ message: "success" });
    } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
    }
  });
// --------------- End Pdf Inspection QC Shaft ---------------------------------------------------------------






module.exports = app;
