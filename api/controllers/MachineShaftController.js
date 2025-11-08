const express = require("express");
const app = express();
const MachineShaftModel = require("../models/MachineShaftModel");
const MasterTypeMachineModel = require("../models/MasterTypeMachineModel")

app.post("/machine/machineRegisterShaft", async (req, res) => {
  try {
    const {Machine_Number , Partname_Model, process, password_input} = req.body
    let result = await MachineShaftModel.create({
        Machine_Number:Machine_Number,
        Partname_Model:Partname_Model,
        process:process,
        password_input:password_input
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.send({ message: e.message });
  }
});

app.get("/getDataMCShaft", async (req, res) => {
  let result = await MachineShaftModel.findAll(
    {
      order: ["Machine_Number"],
    }

    // `select ProductName
    //  from Product`

    // `SELECT *
    //     FROM machines`
  );

  return res.json({ result });
});

app.get("/machines/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/machinesTBS/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TBS%" },
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
app.get("/machinesTBM/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TBM%" },
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
app.get("/machinesTB/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TB-%" },
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
app.get("/machinesTTC/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TTC%" },
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
app.get("/machinesTCH/listShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TCH%" },
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
app.get("/machines/listSearchShaft", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


// API สำหรับดึงข้อมูล Model และ Process โดยใช้ Machine_Number
app.get("/machinesShaft/:machineNumber/details", async (req, res) => {
  try {
    const machineNumber = req.params.machineNumber;
    const machine = await MachineShaftModel.findOne({
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


app.delete("/machines/deleteShaft/:id",  async (req, res) => {
  try {
    await MachineShaftModel.destroy({
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
app.put("/machines/updateShaft/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, password_input } = req.body;
    
    const result = await MachineShaftModel.update(
      {
        Machine_Number: Machine_Number,
        Partname_Model: Partname_Model,
        process: process,
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
  let result = await MachineShaftModel.findAll(
    {
      order: ["process"],
    }
  );

  return res.json({ result });
});

app.get("/getPartModelSearch", async (req, res) => {
  let result = await MachineShaftModel.findAll(
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

const { Op } = require("sequelize");

app.get("/machinesTBM/listOnly", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TBM%" },
            // { [Op.like]: "SB%" },
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
app.get("/machinesTTC/listOnly", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TTC%" },
            // { [Op.like]: "SB%" },
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
app.get("/machinesTBS/listOnly", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TBS%" },
            // { [Op.like]: "SB%" },
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
app.get("/machinesTB/listOnly", async (req, res) => {
  try {
    const results = await MachineShaftModel.findAll({
      where: {
        Machine_Number: {
          [Op.or]: [
            { [Op.like]: "TB-%" },
            // { [Op.like]: "SB%" },
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


app.get("/getDataMCTBSSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TBS'
    let result = await MachineShaftModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TBS-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TBS-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.get("/getDataMCTBMSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TBM'
    let result = await MachineShaftModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TBM-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TBM-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.get("/getDataMCTTCSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TTC'
    let result = await MachineShaftModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TTC-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TTC-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.get("/getDataMCTCHSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TCH'
    let result = await MachineShaftModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TCH-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TCH-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.get("/getDataMCTBSearch", async (req, res) => {
  try {
    // กรองเฉพาะเครื่องจักรที่ขึ้นต้นด้วย 'TCH'
    let result = await MachineShaftModel.findAll({
      attributes: ['Machine_Number'], // ดึงแค่คอลัมน์ Machine_Number
      where: {
        Machine_Number: {
          [Op.like]: 'TB-%', // กรองค่า Machine_Number ที่ขึ้นต้นด้วย 'TCH-'
        },
      },
      order: ['Machine_Number'], // จัดเรียงตาม Machine_Number
    });

    return res.json({ result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;