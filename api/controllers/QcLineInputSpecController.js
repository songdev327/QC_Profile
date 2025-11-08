const express = require("express");
const app = express();
// const QcLineInputSpecModel = require("../models/QcLineInputSpecModel");
const ProductModel = require('../models/ProductModel');
const moment = require('moment');

// app.post('/api/qc-line-input-spec', async (req, res) => {
//     try {
//         const records = req.body;  // ข้อมูลทั้งหมดที่ส่งมาจาก frontend ในรูปแบบ array

//         // ใช้ bulkCreate เพื่อบันทึกหลายบรรทัดในครั้งเดียว
//         const newEntries = await QcLineInputSpecModel.bulkCreate(records, {
//             returning: true
//         });

//         res.status(200).json(newEntries);  // ส่งข้อมูลกลับถ้าการเพิ่มข้อมูลสำเร็จ
//     } catch (error) {
//         console.error('Error while saving data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.put("/api/qc-line-update-spec", async (req, res) => {
//   try {
//     const records = req.body;

//     for (const record of records) {
//       await QcLineInputSpecModel.update(
//         {
//           qc_line_input: record.qc_line_input,
//           spec: record.spec,
//           barcode: record.barcode,
//           machine: record.machine,
//           model: record.model,
//           name_qc_line: record.name_qc_line,
//           date_qc_line: record.date_qc_line,  // รับค่าจาก frontend
//           start_time_qc_line: record.start_time_qc_line,  // รับค่าจาก frontend
//           end_time_qc_line: record.end_time_qc_line,  // รับฟิลด์ end_time_qc_by_off
//           pass: record.pass,  // รับค่า Pass จาก client
//           reject: record.reject  // รับค่า Reject จาก client
//         },
//         {
//           where: {
//             id: record.id,
//           },
//         }
//       );
//     }

//     res.status(200).json({ message: "Data successfully updated" });
//   } catch (error) {
//     console.error("Error while updating data:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });

// app.put("/api/qc-line-update-specTN", async (req, res) => {
//   try {
//     const records = req.body;

//     for (const record of records) {
//       await QcLineInputSpecModel.update(
//         {
//           qc_line_input: record.qc_line_input,
//           spec: record.spec,
//           barcode: record.barcode,
//           machine: record.machine,
//           model: record.model,
//           name_qc_line: record.name_qc_line,
//           date_qc_line: record.date_qc_line,  // รับค่าจาก frontend
//           start_time_qc_line: record.time_qc_by_off,  // รับค่าจาก frontend
//           end_time_qc_line: record.end_time_qc_line,  // รับฟิลด์ end_time_qc_by_off
//           pass: record.pass,  // รับค่า Pass จาก client
//           reject: record.reject  // รับค่า Reject จาก client
//         },
//         {
//           where: {
//             id: record.id,
//           },
//         }
//       );
//     }

//     res.status(200).json({ message: "Data successfully updated" });
//   } catch (error) {
//     console.error("Error while updating data:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });

// app.get('/api/qc-line-input-latest/:productId', async (req, res) => {
//     const { productId } = req.params;
  
//     try {
//       // ดึงข้อมูลจาก QcLineInputSpecModel โดยอ้างอิง productId และเรียงลำดับตาม id ล่าสุด
//       const latestQcData = await QcLineInputSpecModel.findOne({
//         where: { productId: productId },
//         order: [['id', 'DESC']], // เรียงลำดับจากข้อมูลล่าสุด
//       });
  
//       if (!latestQcData) {
//         return res.status(404).json({ message: 'No QC Line Input data found for this productId' });
//       }
  
//       res.json(latestQcData);  // ส่งข้อมูลกลับไปยัง frontend
//     } catch (error) {
//       console.error('Error fetching latest QC Line Input data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

//   app.get('/api/qc-line-input-update/:productId', async (req, res) => {
//     try {
//       const { productId } = req.params;
      
//       // ตรวจสอบว่ามี productId ที่ส่งมาหรือไม่
//       if (!productId) {
//         return res.status(400).json({ message: 'Product ID is required' });
//       }
  
//       // ดึงข้อมูลจาก QcLineInputSpecModel โดยอ้างอิงจาก productId
//       const qcData = await QcLineInputSpecModel.findAll({
//         where: {
//           productId: productId
//         }
//       });
  
//       if (qcData.length === 0) {
//         return res.status(404).json({ message: 'No QC data found for this product' });
//       }
  
//       res.json(qcData); // ส่งข้อมูลกลับไปที่ frontend
//     } catch (error) {
//       console.error('Error fetching QC data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

//   app.get('/api/qc-line-input-pass-reject', async (req, res) => {
//     try {
//       const qcLineData = await QcLineInputSpecModel.findAll({
//         attributes: ['productId', 'tool_no', 'pass', 'reject']
//       });
  
//       if (!qcLineData || qcLineData.length === 0) {
//         return res.status(404).json({ message: 'No pass/reject data found' });
//       }
  
//       res.json(qcLineData);
//     } catch (error) {
//       console.error('Error fetching pass/reject data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

  app.put('/api/product/update-qc-fields', async (req, res) => {
    const { productId, name_qc_by_off, end_time_qc_by_off } = req.body;

    try {
        // อัปเดตข้อมูลใน ProductModel
        await ProductModel.update(
            { 
                name_qc_by_off, 
                end_time_qc_by_off 
            },
            {
                where: { id: productId }
            }
        );

        res.status(200).json({ message: "ProductModel fields updated successfully" });
    } catch (error) {
        console.error("Error updating ProductModel fields:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put('/api/product/update-qc-fieldsTN', async (req, res) => { 
  const { productId, name_qc_by_off, time_qc_by_off, date_qc_by_off } = req.body; // แก้ไขการ destructure ให้ตรงกับค่าจากฟรอนต์เอนด์

  try {
      // อัปเดตข้อมูลใน ProductModel
      await ProductModel.update(
          { 
            name_qc_by_off: name_qc_by_off,
            date_qc_by_off: date_qc_by_off,
            time_qc_by_off: time_qc_by_off,
            end_time_qc_by_off: time_qc_by_off,
          },
          {
              where: { id: productId }
          }
      );

      res.status(200).json({ message: "ProductModel fields updated successfully" });
  } catch (error) {
      console.error("Error updating ProductModel fields:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
app.put('/api/product/update-qc-fieldsTNRepeat', async (req, res) => { 
  const { productId, name_qc_by_off, time_qc_by_off, date_qc_by_off } = req.body; // แก้ไขการ destructure ให้ตรงกับค่าจากฟรอนต์เอนด์

  try {
      // อัปเดตข้อมูลใน ProductModel
      await ProductModel.update(
          { 
            name_qc_by_off: name_qc_by_off,
            date_qc_by_off: date_qc_by_off,
            end_time_qc_by_off: time_qc_by_off,
          },
          {
              where: { id: productId }
          }
      );

      res.status(200).json({ message: "ProductModel fields updated successfully" });
  } catch (error) {
      console.error("Error updating ProductModel fields:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = app;