const express = require("express");
const app = express();
const MasterToolNumberSpecTBMModel = require("../models/MasterToolNumberSpecTBMModel");
// const ProductInputSpecModel = require("../models/ProductInputSpecModel");
// const ProductInputSpecSleeveModel = require("../models/ProductInputSpecSleeveModel");


app.post("/masterNumber/masterNumberSpecToolInsertTBM", async (req, res) => {
  // console.log("Request received:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
  try {
    const { Machine_Number, Partname_Model, process, tool_no, 
      section_check, spec_tool_no, rev_control, part_no, 
      password_input, spec_center, date_control, div_control, sequence_number_spec, mesering_type } = req.body;

    let result = await MasterToolNumberSpecTBMModel.create({
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

app.get("/masterNumber/masterNumberSpecNumberToolListTBM", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTBMModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/masterNumber/masterNumberSpecNumberToolupdateTBM/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, process, tool_no, section_check, 
      spec_tool_no,rev_control, part_no, password_input, 
      spec_center, date_control, div_control, sequence_number_spec, mesering_type  } = req.body;

    const result = await MasterToolNumberSpecTBMModel.update(
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

app.delete("/masterNumber/masterNumberSpecNumberTooldeleteTBM/:id",  async (req, res) => {
  try {
    await MasterToolNumberSpecTBMModel.destroy({
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



app.post("/api/toolNumBerListTBM", async (req, res) => {
  const { machineNumber, partNameModel } = req.body;

  // console.log("API Request:", machineNumber, partNameModel);

  try {
    const toolNumbers = await MasterToolNumberSpecTBMModel.findAll({
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




app.put("/masterToolNumber/updateTBM/:id", async (req, res) => {
  try {
    const { Machine_Number, Partname_Model, tool_no } = req.body;

    const result = await MasterToolNumberSpecTBMModel.update(
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

app.delete("/machinesToolNumber/deleteTBM/:id", async (req, res) => {
  try {
    await MasterToolNumberSpecTBMModel.destroy({
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


// const { Op } = require('sequelize');  // เพิ่มบรรทัดนี้

// app.post('/api/spec1', async (req, res) => {
//   const { tNumbers, machineNumber, partNameModel, productId } = req.body;

//   // console.log("Received params:", req.body);  // ตรวจสอบค่าที่ส่งมาทาง console

//   if (!tNumbers || !machineNumber || !partNameModel || !productId) {
//     return res.status(400).json({ message: 'Missing required parameters' });
//   }

//   try {
//     const specData = await ProductInputSpecModel.findAll({
//       where: {
//         tool_no: { [Op.in]: tNumbers },
//         Machine_Number: machineNumber,
//         Partname_Model: partNameModel,
//         productId: productId,  // เช็คค่า productId ที่ได้รับ
//       },
//       order: [['id', 'ASC']], // เรียงลำดับจากข้อมูลล่าสุด
//     });

//     if (specData.length === 0) {
//       console.log("No data found for these parameters:", req.body); // Log ข้อมูลเมื่อไม่พบ
//       return res.status(404).json({ message: 'No specs found for these parameters' });
//     }

//     res.json(specData);  // ส่งข้อมูล spec กลับไปยัง frontend
//   } catch (error) {
//     console.error("Error fetching specs:", error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });


// app.get('/api/qc-line-input-latestNew/:productId', async (req, res) => {
//   const { productId } = req.params;

//   try {
//     // ดึงข้อมูลจาก QcLineInputSpecModel โดยอ้างอิง productId และเรียงลำดับตาม id ล่าสุด
//     const latestQcData = await ProductInputSpecModel.findOne({
//       where: { productId: productId },
//       order: [['id', 'ASC']], // เรียงลำดับจากข้อมูลล่าสุด
//     });

//     if (!latestQcData) {
//       return res.status(404).json({ message: 'No QC Line Input data found for this productId' });
//     }

//     res.json(latestQcData);  // ส่งข้อมูลกลับไปยัง frontend
//   } catch (error) {
//     console.error('Error fetching latest QC Line Input data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.get('/api/qc-line-input-updateNew/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     // ตรวจสอบว่ามี productId ที่ส่งมาหรือไม่
//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     // ดึงข้อมูลจาก QcLineInputSpecModel โดยอ้างอิงจาก productId
//     const qcData = await ProductInputSpecModel.findAll({
//       where: {
//         productId: productId
//       },
//       order: [['id', 'ASC']] // เพิ่มการเรียงข้อมูลตาม id
//     });

//     if (qcData.length === 0) {
//       return res.status(404).json({ message: 'No QC data found for this product' });
//     }

//     res.json(qcData); // ส่งข้อมูลกลับไปที่ frontend
//   } catch (error) {
//     console.error('Error fetching QC data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.get('/api/qc-line-input-pass-rejectNew', async (req, res) => {
//   try {
//     const qcLineData = await ProductInputSpecModel.findAll({
//       attributes: ['productId', 'tool_no', 'pass', 'reject']
//     });

//     if (!qcLineData || qcLineData.length === 0) {
//       return res.status(404).json({ message: 'No pass/reject data found' });
//     }

//     res.json(qcLineData);
//   } catch (error) {
//     console.error('Error fetching pass/reject data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


app.get("/masterSpecTool/masterSpecToolSearchTBM", async (req, res) => {
  try {
    const results = await MasterToolNumberSpecTBMModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", result: results }); // ควรใช้ result แทน results
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;