const express = require("express");
const app = express();
const MasterToolNumberSpecTCHModel = require("../models/MasterToolNumberSpecTCHModel");
// const ProductInputSpecModel = require("../models/ProductInputSpecModel");
// const ProductInputSpecSleeveModel = require("../models/ProductInputSpecSleeveModel");


app.post("/masterNumber/masterNumberSpecToolInsertTCH", async (req, res) => {
  // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
  try {
    const { Machine_Number, Partname_Model, process, tool_no, 
      section_check, spec_tool_no, rev_control, part_no, password_input, 
      spec_center, date_control, div_control, sequence_number_spec, mesering_type } = req.body;

    let result = await MasterToolNumberSpecTCHModel.create({
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

app.get("/masterNumber/masterNumberSpecNumberToolListTCH", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTCHModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/masterNumber/masterNumberSpecNumberToolupdateTCH/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, tool_no, 
      section_check, spec_tool_no,rev_control, part_no, password_input, 
      spec_center, date_control, div_control, sequence_number_spec, mesering_type  } = req.body;

    const result = await MasterToolNumberSpecTCHModel.update(
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

app.delete("/masterNumber/masterNumberSpecNumberTooldeleteTCH/:id",  async (req, res) => {
  try {
    await MasterToolNumberSpecTCHModel.destroy({
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



app.post("/api/toolNumBerListTCH", async (req, res) => {
  const { machineNumber, partNameModel } = req.body;

  // console.log("API Request:", machineNumber, partNameModel);

  try {
    const toolNumbers = await MasterToolNumberSpecTCHModel.findAll({
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




app.put("/masterToolNumber/updateTCH/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, tool_no } = req.body;

    const result = await MasterToolNumberSpecTCHModel.update(
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

app.delete("/machinesToolNumber/deleteTCH/:id", async (req, res) => {
  try {
    await MasterToolNumberSpecTCHModel.destroy({
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


app.get("/masterSpecTool/masterSpecToolSearchTCH", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTCHModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;