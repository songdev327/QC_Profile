const express = require("express");
const app = express();
const MasterToolNumberSpecSleeveModel = require("../models/MasterToolNumberSpecSleeveModel");

app.post("/masterNumberSleeve/masterNumberSpecToolInsert", async (req, res) => {
  // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
  try {
    const { Machine_Number, Partname_Model, process, tool_no, 
      section_check, spec_tool_no, rev_control, part_no, 
      password_input, spec_center, date_control, div_control, 
      sequence_number_spec, mesering_type} = req.body;

    let result = await MasterToolNumberSpecSleeveModel.create({
      Machine_Number: Machine_Number,
      Partname_Model: Partname_Model,
      process: process,
      tool_no: tool_no,
      section_check: section_check,
      spec_tool_no: spec_tool_no,
      rev_control: rev_control,
      part_no: part_no,
      password_input:password_input,
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

app.get("/masterNumberSleeve/masterNumberSpecNumberToolList", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecSleeveModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/masterNumberSleeve/masterNumberSpecNumberToolupdate/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, tool_no, 
      section_check, spec_tool_no, rev_control, part_no, 
      password_input, spec_center, date_control, div_control, 
      sequence_number_spec, mesering_type} = req.body;

    const result = await MasterToolNumberSpecSleeveModel.update(
      {
        Machine_Number: Machine_Number,
        Partname_Model: Partname_Model,
        process: process,
        tool_no: tool_no,
        section_check: section_check,
        spec_tool_no: spec_tool_no,
        rev_control: rev_control,
        part_no: part_no,
        password_input:password_input,
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

app.delete("/masterNumberSleeve/masterNumberSpecNumberTooldelete/:id",  async (req, res) => {
  try {
    await MasterToolNumberSpecSleeveModel.destroy({
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

app.get("/masterSpecToolSleeve/masterSpecToolSearchSleeve", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecSleeveModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.get("/masterSpecToolModel/masterSpecToolSearchModelSleeve", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecSleeveModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;