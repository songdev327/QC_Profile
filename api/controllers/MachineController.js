const express = require("express");
const app = express();
const MachineModel = require("../models/MachineModel");
const MasterTypeMachineModel = require("../models/MasterTypeMachineModel")

app.post("/machine/machineRegister", async (req, res) => {
  try {
    const {Machine_Number , Partname_Model, process, 
       ip_address, system_no, address_type, address_no, 
       password_input} = req.body
    let result = await MachineModel.create({
        Machine_Number:Machine_Number,
        Partname_Model:Partname_Model,
        process:process,
         ip_address: ip_address,
        system_no: system_no,
        address_type: address_type,
        address_no: address_no,
        password_input:password_input
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.send({ message: e.message });
  }
});

app.get("/getDataMC", async (req, res) => {
  let result = await MachineModel.findAll(
    {
      order: ["Machine_Number"],
    }
  );

  return res.json({ result });
});

app.get("/getDataMCTNSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TN'
    let result = await MachineModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TN-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TN-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/getDataMCCHSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'CH'
    let result = await MachineModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'CH-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TN-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/machines/list", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

const { Op } = require("sequelize");

app.get("/machinesCSSB/listOnly", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "CS%" },
            { [Op.like]: "SB%" },
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get("/machinesTN/listOnly", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TN%" },
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/machinesCH/listOnlyTool", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "CH%" },
    
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get("/machinesCS/listOnlyTool", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "CS%" },
    
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get("/machinesSB/listOnlyTool", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "SB%" },
    
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get("/machinesTN/listOnlyTool", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TN%" },
    
          ],
        },
      },
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// เช็คโครงสร้างของข้อมูลที่ส่งกลับจาก API
app.get("/machines/listSearch", async (req, res) => {
  try {
    const results = await MachineModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


// API สำหรับดึงข้อมูล Model และ Process โดยใช้ Machine_Number
app.get("/machines/:machineNumber/details", async (req, res) => {
  try {
    const machineNumber = req.params.machineNumber;
    const machine = await MachineModel.findOne({
      where: { Machine_Number: machineNumber },
    });

    // console.log("Machine found:", machine); // เพิ่มการ log เพื่อดูข้อมูลจากฐานข้อมูล

    if (machine) {
      res.send({
        message: "success",
        model: machine.Partname_Model,
        process: machine.process,  // เพิ่ม process ในการ response
      });
    } else {
      res.status(404).send({ message: "Machine not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/machines/:machineNumberCH/detailsCH", async (req, res) => {
  try {
    const machineNumberCH = req.params.machineNumberCH;
    const machine = await MachineModel.findOne({
      where: { Machine_Number: machineNumberCH },
    });

    // console.log("Machine found:", machine); // เพิ่มการ log เพื่อดูข้อมูลจากฐานข้อมูล

    if (machine) {
      res.send({
        message: "success",
        model: machine.Partname_Model,
        process: machine.process,  // เพิ่ม process ในการ response
        ip_address: machine.ip_address,
        system_no: machine.system_no,
        address_type: machine.address_type,
        address_no: machine.address_no, 
      });
    } else {
      res.status(404).send({ message: "Machine not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.delete("/machines/delete/:id",  async (req, res) => {
  try {
    await MachineModel.destroy({
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
app.put("/machines/update/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process,
       ip_address, system_no, address_type, address_no,
      password_input } = req.body;
    
    const result = await MachineModel.update(
      {
        Machine_Number: Machine_Number,
        Partname_Model: Partname_Model,
        process: process,
         ip_address: ip_address,
        system_no: system_no,
        address_type: address_type,
        address_no: address_no,
        password_input: password_input
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

app.get("/getProcessSearch", async (req, res) => {
  let result = await MachineModel.findAll(
    {
      order: ["process"],
    }
  );

  return res.json({ result });
});

app.get("/getPartModelSearch", async (req, res) => {
  let result = await MachineModel.findAll(
    {
      order: ["Partname_Model"],
    }
  );
  return res.json({ result });
});

app.post("/machine/machineRegisterMachineType", async (req, res) => {
  try {
    const { machine_type } = req.body
    let result = await MasterTypeMachineModel.create({
      machine_type:machine_type,
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.send({ message: e.message });
  }
});

app.get("/machines/listMachineType", async (req, res) => {
  try {
    const results = await MasterTypeMachineModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/machines/updateMachineType/:id", async (req, res) => {
  try {
    const { machine_type } = req.body;
    
    const result = await MasterTypeMachineModel.update(
      {
        machine_type: machine_type,
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
app.delete("/machines/deleteMachineType/:id",  async (req, res) => {
  try {
    await MasterTypeMachineModel.destroy({
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

module.exports = app;