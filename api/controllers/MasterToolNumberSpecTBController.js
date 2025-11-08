const express = require("express");
const app = express();
const MasterToolNumberSpecTBModel = require("../models/MasterToolNumberSpecTBModel");
// const ProductInputSpecModel = require("../models/ProductInputSpecModel");
// const ProductInputSpecSleeveModel = require("../models/ProductInputSpecSleeveModel");


app.post("/masterNumber/masterNumberSpecToolInsertTB", async (req, res) => {
  // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
  try {
    const { Machine_Number, Partname_Model, process, tool_no,
       section_check, spec_tool_no, rev_control, part_no, password_input, 
       spec_center, date_control, div_control, sequence_number_spec, mesering_type } = req.body;

    let result = await MasterToolNumberSpecTBModel.create({
      Machine_Number: Machine_Number,
      Partname_Model: Partname_Model,
      process: process,
      tool_no: tool_no,
      section_check: section_check,
      spec_tool_no: spec_tool_no,
      rev_control: rev_control,
      part_no: part_no,
      password_input: password_input, 
      spec_center: spec_center,
      date_control: date_control,
      div_control: div_control,
      sequence_number_spec: sequence_number_spec,
      mesering_type: mesering_type,
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    console.error(e); // แสดงข้อผิดพลาดใน console
    res.send({ message: e.message });
  }
});

app.get("/masterNumber/masterNumberSpecNumberToolListTB", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTBModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/masterNumber/masterNumberSpecNumberToolupdateTB/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, tool_no, section_check, 
      spec_tool_no,rev_control, part_no, password_input, 
      spec_center, date_control, div_control, sequence_number_spec, mesering_type } = req.body;

    const result = await MasterToolNumberSpecTBModel.update(
      {
        Machine_Number: Machine_Number,
        Partname_Model: Partname_Model,
        process: process,
        tool_no: tool_no,
        section_check: section_check,
        spec_tool_no: spec_tool_no,
        rev_control: rev_control,
        part_no: part_no,
        password_input: password_input, 
        spec_center: spec_center,
        date_control: date_control,
        div_control: div_control,
        sequence_number_spec: sequence_number_spec,
        mesering_type: mesering_type,
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

app.delete("/masterNumber/masterNumberSpecNumberTooldeleteTB/:id",  async (req, res) => {
  try {
    await MasterToolNumberSpecTBModel.destroy({
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



app.post("/api/toolNumBerListTB", async (req, res) => {
  const { machineNumber, partNameModel } = req.body;

  // console.log("API Request:", machineNumber, partNameModel);

  try {
    const toolNumbers = await MasterToolNumberSpecTBModel.findAll({
      where: {
        Machine_Number: machineNumber.trim(),
        Partname_Model: partNameModel.trim(),
      },
      attributes: ["tool_no"],
    });

    // console.log("Fetched Tool Numbers:", toolNumbers); // บันทึกค่าที่ได้จากฐานข้อมูล

    if (!toolNumbers.length) {
      return res.status(404).json({ message: "ไม่พบหมายเลขเครื่องมือ" });
    }

    res.json(toolNumbers); // ส่ง tool numbers ไปยัง frontend
  } catch (error) {
    console.error("Error fetching tool numbers:", error);
    res.status(500).json({ message: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

app.put("/masterToolNumber/updateTB/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, tool_no } = req.body;

    const result = await MasterToolNumberSpecTBModel.update(
      {
        Machine_Number: Machine_Number.trim(),
        Partname_Model: Partname_Model.trim(),
        tool_no: tool_no,
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

app.delete("/machinesToolNumber/deleteTB/:id", async (req, res) => {
  try {
    await MasterToolNumberSpecTBModel.destroy({
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


app.get("/masterSpecTool/masterSpecToolSearchTB", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTBModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;