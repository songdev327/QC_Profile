const express = require("express");
const app = express();
const MasterToolNumberCSModel = require("../models/MasterToolNumberCSModel");
const MasterToolNumberSpecCSModel = require("../models/MasterToolNumberSpecCSModel");

app.post("/masterToolNumber/masterToolNumberInsertSleeveCS", async (req, res) => {
  // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
  try {
    const { Machine_Number, Partname_Model, process, tool_no, password_input } = req.body;

    let result = await MasterToolNumberCSModel.create({
      Machine_Number: Machine_Number,
      Partname_Model: Partname_Model,
      process: process,
      tool_no: tool_no,
      password_input: password_input,
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    console.error(e); // แสดงข้อผิดพลาดใน console
    res.send({ message: e.message });
  }
});

app.get("/masterToolNumber/masterToolNumberListSleeveCS", async (req, res) => {
  try {
    const results = await MasterToolNumberCSModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.post("/api/toolNumBerListNewSpecSleeveCS", async (req, res) => {
  const { machineNumber, partNameModel, processName } = req.body;

  // console.log("Received request with:", { machineNumber, partNameModel }); // ตรวจสอบค่าที่ได้รับ

  try {
    const toolNumbers = await MasterToolNumberCSModel.findAll({
      where: {
        Machine_Number: machineNumber.trim(),
        Partname_Model: partNameModel.trim(),
        process: processName.trim(),
      },
      attributes: ["tool_no"],
      order: [['id', 'ASC']], // ลำดับจาก id
    });

    // console.log("Fetched Tool Numbers:", toolNumbers); // ตรวจสอบค่าที่ได้จากฐานข้อมูล

    if (!toolNumbers.length) {
      return res.status(404).json({ message: "ไม่พบหมายเลขเครื่องมือ" });
    }

  const toolNumbersWithSpecs = await Promise.all(toolNumbers.map(async (tool) => {
  const specs = await MasterToolNumberSpecCSModel.findAll({
    where: {
      Machine_Number: machineNumber.trim(),
      Partname_Model: partNameModel.trim(),
      process: processName.trim(),
      tool_no: tool.tool_no,
    },
    attributes: ["tool_no", "section_check", "spec_tool_no", "pass", "reject", "rev_control", "part_no", "spec_center"],
    order: [['sequence_number_spec', 'ASC']], // ลำดับจาก id
  });

  return {
    ...tool.dataValues,
    specs: specs.map(spec => ({
      ...spec.dataValues,
      pass: spec.dataValues.pass || "", // ตรวจสอบค่าที่ได้จากฐานข้อมูล
      reject: spec.dataValues.reject || "", 
    })),
  };
}));
res.json(toolNumbersWithSpecs);
  } catch (error) {
    console.error("Error fetching tool numbers:", error); // บันทึกข้อผิดพลาด
    res.status(500).json({ message: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

app.put("/masterToolNumber/updateSleeveCS/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, tool_no, password_input } = req.body;
    
    const result = await MasterToolNumberCSModel.update(
      {
        Machine_Number: Machine_Number.trim(),
        Partname_Model: Partname_Model.trim(),
        process: process.trim(),
        tool_no: tool_no,
        password_input:password_input,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (result[0] > 0) {
      res.send({ message: "success" });
    } else {
      res.status(404).send({ message: "Machine not found or no changes made" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/machinesToolNumber/deleteSleeveCS/:id",  async (req, res) => {
  try {
    await MasterToolNumberCSModel.destroy({
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

app.get("/machinesToolNumber/listSearchToolSleeveCS", async (req, res) => {
  try {
    const results = await MasterToolNumberCSModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});



module.exports = app;