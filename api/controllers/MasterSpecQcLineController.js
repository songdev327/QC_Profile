const express = require("express");
const app = express();
const MasterSpecQcLineModel = require("../models/MasterSpecQcLineModel");
const MasterTypeMachineModel = require("../models/MasterTypeMachineModel");
// const QcLineInputSpecModel = require('../models/QcLineInputSpecModel');

app.post("/masterSpecQcLine/masterSpecQcLineInsert", async (req, res) => {
    // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
    try {
      const {Machine_Number, Partname_Model, tool_no, spec} = req.body;

      let result = await MasterSpecQcLineModel.create({
        Machine_Number: Machine_Number,
        Partname_Model: Partname_Model,
        tool_no: tool_no,
        spec: spec

      });
      res.send({ message: "success", result: result });
    } catch (e) {
      console.error(e); // แสดงข้อผิดพลาดใน console
      res.send({ message: e.message });
    }
  });

  app.get("/masterSpecQcLine/masterSpecQcLineList", async (req, res) => {
    try {
      const results = await MasterSpecQcLineModel.findAll({
        order: [["id", "ASC"]],
      });
      res.send({ message: "success", results: results });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  });

  app.put("/masterSpecQcLine/update/:id", async (req, res) => {
    try {
      const { Machine_Number, Partname_Model, tool_no, spec } = req.body;
      
      const result = await MasterSpecQcLineModel.update(
        {
          Machine_Number: Machine_Number,
          Partname_Model: Partname_Model,
          tool_no: tool_no,
          spec: spec,
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

  app.delete("/masterSpecQcLine/delete/:id",  async (req, res) => {
    try {
      await MasterSpecQcLineModel.destroy({
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

  app.get("/masterSpecQcLine/listSearchSpec", async (req, res) => {
    try {
      const results = await MasterSpecQcLineModel.findAll({
        order: [["id", "ASC"]],
      });
      res.send({ message: "success", result: results }); // ควรใช้ result แทน results
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  });

  app.get("/masterSpecQcLine/listSearchTypeMC", async (req, res) => {
    try {
      const results = await MasterTypeMachineModel.findAll({
        order: [["id", "ASC"]],
      });
      res.send({ message: "success", result: results }); // ควรใช้ result แทน results
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  });


  const { Op } = require('sequelize');

  app.post('/api/spec', async (req, res) => {
    const { tNumbers, machineNumber, partNameModel } = req.body;

    // console.log('API Request:', tNumbers, machineNumber, partNameModel);

    try {
      const specData = await MasterSpecQcLineModel.findAll({
        where: {
            tool_no: {
                [Op.in]: tNumbers
            },
            Machine_Number: machineNumber,
            Partname_Model: partNameModel,
        }
    });

  //   const specData = await MasterSpecQcLineModel.findAll({
  //     where: {
  //         tool_no: tNumbers, // tNumbers เป็นอาเรย์ ให้แน่ใจว่าการจัดการถูกต้อง
  //         Machine_Number: machineNumber,
  //         Partname_Model: partNameModel,
  //     }
  // });

        if (!specData.length) {
            return res.status(404).json({ message: 'No specs found for these T Numbers' });
        }

        res.json(specData);  // ส่งข้อมูล spec กลับไปยัง frontend
    } catch (error) {
        console.error('Error fetching specs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/specTN', async (req, res) => {
  const { tNumbers, machineNumber, partNameModel } = req.body;

  // console.log('API Request:', tNumbers, machineNumber, partNameModel);

  try {
      const specData = await MasterSpecQcLineModel.findAll({
        where: {
          tool_no: {
              [Op.in]: tNumbers
          },
          Machine_Number: machineNumber,
          Partname_Model: partNameModel,
      }
      });

      if (!specData.length) {
          return res.status(404).json({ message: 'No specs found for these T Numbers' });
      }

      res.json(specData);  // ส่งข้อมูล spec กลับไปยัง frontend
  } catch (error) {
      console.error('Error fetching specs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;