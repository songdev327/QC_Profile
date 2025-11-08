const express = require('express')
const app = express()
const ProductModel = require('../models/ProductModel');
const Service = require('./Service');
const dayjs = require("dayjs");
const ProductImageModel = require('../models/ProductImageModel');
const ProductInputSpecModel = require('../models/ProductInputSpecModel');


app.post("/product/insert", Service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    // payload.userId = Service.getMemberId(req);

    const result = await ProductModel.create(payload);
    res.send({ result: result, message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});


app.post("/product/insertNewToolAuto", Service.isLogin, async (req, res) => {
  try {
    let payload = req.body;

    // console.log("Received Payload:", payload); // บันทึก Payload ที่ได้รับ

    const result = await ProductModel.create(payload);
    res.send({ result: result, message: "success" });
  } catch (e) {
    console.error("Error while inserting product:", e); // บันทึกข้อผิดพลาด
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

// API สำหรับการเพิ่มข้อมูลใน ProductInputSpecModel
app.post("/product/insertProductInputSpec", Service.isLogin, async (req, res) => {
  try {
    const productInputSpecs = req.body; // รับข้อมูลที่ส่งมา

    // console.log("Received Product Input Specs:", productInputSpecs);

    // ตรวจสอบและตั้งค่า pass และ reject เป็นค่าว่างหากไม่มีค่า
    productInputSpecs.forEach((spec) => {
      if (!spec.spec_tool_no || spec.spec_tool_no.trim() === "") {
        spec.spec_tool_no = ""; // ถ้าไม่มีค่าให้เป็นค่าว่าง
      }

      if (!spec.pass) {
        spec.pass = "";  // ถ้า pass ไม่มีค่าให้เป็นค่าว่าง
      }
      if (!spec.reject) {
        spec.reject = "";  // ถ้า reject ไม่มีค่าให้เป็นค่าว่าง
      }

      // ตรวจสอบและเพิ่มค่า tool_change_case ที่ได้รับมา
      if (!spec.tool_change_case) {
        spec.tool_change_case = "";  // ถ้าไม่มีค่าให้เป็นค่าว่าง
      }
    });

    // เพิ่มข้อมูลลงใน ProductInputSpecModel โดยใช้ bulkCreate
    const result = await ProductInputSpecModel.bulkCreate(productInputSpecs); // ใช้ bulkCreate สำหรับเพิ่มข้อมูลหลายแถว

    res.send({ result: result, message: "success" });
  } catch (e) {
    console.error("Error while inserting product input specs:", e);
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/product/insertProductInputSpecSleeve", Service.isLogin, async (req, res) => {
  try {
    const productInputSpecs = req.body; // รับข้อมูลที่ส่งมา
    // console.log("Received Product Input Specs:", productInputSpecs);

    // ตรวจสอบและตั้งค่า pass และ reject เป็นค่าว่างหากไม่มีค่า
    productInputSpecs.forEach((spec) => {
      if (!spec.spec_tool_no || spec.spec_tool_no.trim() === "") {
        spec.spec_tool_no = ""; // ถ้าไม่มีค่าให้เป็นค่าว่าง
      }

      if (!spec.pass) {
        spec.pass = "";  // ถ้า pass ไม่มีค่าให้เป็นค่าว่าง
      }
      if (!spec.reject) {
        spec.reject = "";  // ถ้า reject ไม่มีค่าให้เป็นค่าว่าง
      }

      // ตรวจสอบและเพิ่มค่า tool_change_case ที่ได้รับมา
      if (!spec.tool_change_case) {
        spec.tool_change_case = "";  // ถ้าไม่มีค่าให้เป็นค่าว่าง
      }
    });

    // เพิ่มข้อมูลลงใน ProductInputSpecModel โดยใช้ bulkCreate
    const result = await ProductInputSpecModel.bulkCreate(productInputSpecs); // ใช้ bulkCreate สำหรับเพิ่มข้อมูลหลายแถว

    res.send({ result: result, message: "success" });
  } catch (e) {
    console.error("Error while inserting product input specs:", e);
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

// API สำหรับการอัปเดตข้อมูล Product
app.put("/product/updateToolAuto", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    // ตรวจสอบว่า productId ถูกส่งมาหรือไม่
    if (!payload.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

   
    const [updated] = await ProductModel.update(
      {
        name_qc_by_off: payload.name_qc_by_off, // อัปเดต name_qc_by_off
        end_time_qc_by_off: payload.end_time_qc_by_off || null, // อัปเดต end_time_qc_by_off
      },
      {
        where: { id: payload.productId }, // ใช้ productId เพื่อตรวจสอบว่าเป็นสินค้าที่ต้องการอัปเดต
      }
    );

    if (!updated) {
      return res.status(404).send({ message: "Product not found or no changes made" });
    }

    res.send({ message: "Product updated successfully", result: payload });
  } catch (e) {
    console.error("Error while updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/product/updateToolAutoDetail", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    const fieldsToUpdate = {
      name_qc_by_off: payload.name_qc_by_off || null,
      end_time_qc_by_off: payload.end_time_qc_by_off || null,
    };

    // ✅ รองรับการอัปเดตคอลัมน์ qcline_status_detail (ถ้าส่งมา)
    if (typeof payload.qcline_status_detail !== "undefined") {
      fieldsToUpdate.qcline_status_detail = payload.qcline_status_detail;
    }

    const [updated] = await ProductModel.update(fieldsToUpdate, {
      where: { id: payload.productId },
    });

    if (!updated) {
      return res.status(404).send({ message: "Product not found or no changes made" });
    }

    res.send({ message: "Product updated successfully", result: payload });
  } catch (e) {
    console.error("Error while updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/product/updateToolAutoSleeve", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    // ตรวจสอบว่า productId ถูกส่งมาหรือไม่
    if (!payload.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    // console.log("Received Payload for update:", payload); // บันทึก Payload ที่ได้รับ

    // อัปเดตข้อมูลใน ProductModel โดยใช้ productId
    const [updated] = await ProductModel.update(
      {
        name_qc_by_off: payload.name_qc_by_off,
        end_time_qc_by_off: payload.end_time_qc_by_off || null, // แปลงค่าว่างเป็น null
      },
      {
        where: { id: payload.productId },
      }
    );

    if (!updated) {
      return res.status(404).send({ message: "Product not found or no changes made" });
    }

    res.send({ message: "Product updated successfully", result: payload });
  } catch (e) {
    console.error("Error while updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/productTN/TNupdateToolAutoSleeve", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    // ตรวจสอบว่า productId ถูกส่งมาหรือไม่
    if (!payload.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    // ตรวจสอบค่าของ qcline_status_detail และเพิ่มไปใน payload
    const { qcline_status_detail } = payload;

    // console.log("Received Payload for update:", payload); // บันทึก Payload ที่ได้รับ

    // อัปเดตข้อมูลใน ProductModel โดยใช้ productId
    const [updated] = await ProductModel.update(
      {
        name_qc_by_off: payload.name_qc_by_off,
        end_time_qc_by_off: payload.end_time_qc_by_off || null, // แปลงค่าว่างเป็น null
        qcline_status_detail: qcline_status_detail || null, // เพิ่มการอัปเดต qcline_status_detail
      },
      {
        where: { id: payload.productId },
      }
    );

    if (!updated) {
      return res.status(404).send({ message: "Product not found or no changes made" });
    }

    res.send({ message: "Product updated successfully", result: payload });
  } catch (e) {
    console.error("Error while updating product:", e);
    res.status(500).send({ message: e.message });
  }
});


app.put("/product/updateToolAutoSleeveQCLineOnly", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    // ตรวจสอบว่า productId ถูกส่งมาหรือไม่
    if (!payload.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    // console.log("Received Payload for update:", payload); // บันทึก Payload ที่ได้รับ

    // อัปเดตข้อมูลใน ProductModel โดยใช้ productId
    const [updated] = await ProductModel.update(
      {
        name_qc_by_off: payload.name_qc_by_off,
        end_time_qc_by_off: payload.end_time_qc_by_off || null, // แปลงค่าว่างเป็น null
        qcline_status: payload.qcline_status || null, // เพิ่ม qcline_status ที่จะอัปเดตในฐานข้อมูล
        barcode: payload.barcode, // รับค่า barcode มาอัปเดต
      },
      {
        where: { id: payload.productId },
      }
    );

    if (!updated) {
      return res.status(404).send({ message: "Product not found or no changes made" });
    }

    res.send({ message: "Product updated successfully", result: payload });
  } catch (e) {
    console.error("Error while updating product:", e);
    res.status(500).send({ message: e.message });
  }
});


app.put("/product/updateProductInputSpec", async (req, res) => {
  try {
    const productInputSpecs = req.body;
    // console.log("Received data for update:", productInputSpecs);

    if (!productInputSpecs || !productInputSpecs.length) {
      return res.status(400).send({ message: "No data to update" });
    }

    const updatedSpecs = [];

    // วนลูปผ่านข้อมูลที่ส่งมา
    for (const spec of productInputSpecs) {
      // ตรวจสอบว่ามี id, productId, และ tool_no หรือไม่
      if (spec.id && spec.productId && spec.tool_no) {
        // ใช้ sequelize เพื่ออัปเดตข้อมูลในฐานข้อมูล
        const [updated] = await ProductInputSpecModel.update(
          {
            ...(spec.spec_tool_no_input && {
              spec_tool_no_input: spec.spec_tool_no_input, // อัปเดต spec_tool_no_input
            }),
            ...(spec.pass && { pass: spec.pass }), // อัปเดต Pass
            ...(spec.reject && { reject: spec.reject }), // อัปเดต Reject
            ...(spec.name_qc_line && { name_qc_line: spec.name_qc_line }),
            ...(spec.date_qc_line && { date_qc_line: spec.date_qc_line }),
            ...(spec.start_time_qc_line && {
              start_time_qc_line: spec.start_time_qc_line,
            }),
            ...(spec.end_time_qc_line && {
              end_time_qc_line: spec.end_time_qc_line,
            }),
          },
          {
            where: { id: spec.id }, // ใช้ id ในการค้นหาข้อมูลที่ต้องการอัปเดต
          }
        );

        // ตรวจสอบว่ามีการอัปเดตสำเร็จหรือไม่

        // console.log(
        //   updated ? "Updated successfully" : "Update failed for:",
        //   spec
        // );

        // ถ้าอัปเดตสำเร็จให้เพิ่มเข้าไปใน updatedSpecs
        if (updated) {
          updatedSpecs.push(spec);
        }
      }
    }

    // หากไม่มีการอัปเดตใดๆ
    if (updatedSpecs.length === 0) {
      return res.status(404).send({ message: "No records found to update" });
    }

    // ส่งการตอบกลับเมื่อการอัปเดตสำเร็จ
    res.send({
      message: "ProductInputSpec updated successfully",
      updatedSpecs,
    });
  } catch (e) {
    console.error("Error while updating ProductInputSpec:", e);
    res.status(500).send({ message: e.message });
  }
});
// API สำหรับการอัปเดตข้อมูล ProductInputSpecModel

app.put("/product/updateProductInputSpecSleeve", async (req, res) => {
  try {
    const productInputSpecs = req.body;
    // console.log("Received data for update:", productInputSpecs);

    if (!productInputSpecs || !productInputSpecs.length) {
      return res.status(400).send({ message: "No data to update" });
    }

    const updatedSpecs = [];

    // วนลูปผ่านข้อมูลที่ส่งมา
    for (const spec of productInputSpecs) {
      // ตรวจสอบว่ามี id, productId, และ tool_no หรือไม่
      if (spec.id && spec.productId && spec.tool_no) {
        // ใช้ sequelize เพื่ออัปเดตข้อมูลในฐานข้อมูล
        const [updated] = await ProductInputSpecModel.update(
          {
            ...(spec.spec_tool_no_input && {
              spec_tool_no_input: spec.spec_tool_no_input, // อัปเดต spec_tool_no_input
            }),
            ...(spec.pass && { pass: spec.pass }), // อัปเดต Pass
            ...(spec.reject && { reject: spec.reject }), // อัปเดต Reject
            ...(spec.name_qc_line && { name_qc_line: spec.name_qc_line }),
            ...(spec.date_qc_line && { date_qc_line: spec.date_qc_line }),
            ...(spec.start_time_qc_line && {
              start_time_qc_line: spec.start_time_qc_line,
            }),
            ...(spec.end_time_qc_line && {
              end_time_qc_line: spec.end_time_qc_line,
            }),
          },
          {
            where: { id: spec.id }, // ใช้ id ในการค้นหาข้อมูลที่ต้องการอัปเดต
          }
        );

        // ตรวจสอบว่ามีการอัปเดตสำเร็จหรือไม่

        // console.log(
        //   updated ? "Updated successfully" : "Update failed for:",
        //   spec
        // );

        // ถ้าอัปเดตสำเร็จให้เพิ่มเข้าไปใน updatedSpecs
        if (updated) {
          updatedSpecs.push(spec);
        }
      }
    }

    // หากไม่มีการอัปเดตใดๆ
    if (updatedSpecs.length === 0) {
      return res.status(404).send({ message: "No records found to update" });
    }

    // ส่งการตอบกลับเมื่อการอัปเดตสำเร็จ
    res.send({
      message: "ProductInputSpec updated successfully",
      updatedSpecs,
    });
  } catch (e) {
    console.error("Error while updating ProductInputSpec:", e);
    res.status(500).send({ message: e.message });
  }
});


app.get('/product/list', Service.isLogin, async (req, res) => {
  try {
    const limit = 100; // กำหนดจำนวนรายการต่อหน้า
    const offset = 0; // เริ่มที่บรรทัดแรก

    ProductModel.hasMany(ProductImageModel);
    const results = await ProductModel.findAll({
      include: [{
        model: ProductImageModel,
        // required: false // This indicates it's a left join
      }],
      order: [['id', 'DESC']], // เรียงลำดับจากล่าสุดไปเก่าสุด
      limit, // จำกัดจำนวนรายการที่ดึงออกมา
      offset // เริ่มจากรายการแรก (ล่าสุด)
    });
    
    res.send({ results, message: 'success' });
    // console.log(results);
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});


app.get('/product/listNew', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CH%' },
                { [Op.like]: 'CS%' },
                { [Op.like]: 'SB%' },
                { [Op.like]: 'TN%' },
                { [Op.like]: 'TBS%' },
                { [Op.like]: 'TBM%' },
                { [Op.like]: 'TTC%' },
                { [Op.like]: 'TCH%' },
                { [Op.like]: 'TB-%' }
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get('/productSLV/listNewComponentSLV', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CH%' },
                { [Op.like]: 'CS%' },
                { [Op.like]: 'SB%' },
                { [Op.like]: 'TN%' },
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get('/productSFH/listNewComponentSFH', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'TBS%' },
                { [Op.like]: 'TBM%' },
                { [Op.like]: 'TTC%' },
                { [Op.like]: 'TCH%' },
                { [Op.like]: 'TB-%' }
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.get('/product/listNewProductionSleeve', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CH%' },
                // { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
                // { [Op.like]: 'TN%' },
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.get('/product/listNewProductionSleeveCS', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get('/product/listNewProductionSleeveSB', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'CS%' },
                { [Op.like]: 'SB%' },
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get('/product/listNewProductionSleeveTN', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
    const results = await ProductModel.findAll({
      limit, // จำกัดข้อมูลที่ดึงเป็น 200 บรรทัด
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'TN%' },
            ]
        }
    },
      order: [['id', 'DESC']] // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.get('/product/listNewMachineShaft', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
      const results = await ProductModel.findAll({
          limit,
          offset,
          where: {
              machine: {
                  [Op.or]: [
                      { [Op.like]: 'TBS%' },
                      // { [Op.like]: 'TBM%' },
                      // { [Op.like]: 'TTC%' },
                      // { [Op.like]: 'TCH%' },
                      // { [Op.like]: 'TB-%' }
                  ]
              }
          },
          order: [['id', 'DESC']]
      });

      res.send({ results, message: 'success' });
  } catch (e) {
      res.status(500).send({ message: e.message });
  }
});
app.get('/product/listNewMachineShaftTBM', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
      const results = await ProductModel.findAll({
          limit,
          offset,
          where: {
              machine: {
                  [Op.or]: [
                      // { [Op.like]: 'TBS%' },
                      { [Op.like]: 'TBM%' },
                      // { [Op.like]: 'TTC%' },
                      // { [Op.like]: 'TCH%' },
                      // { [Op.like]: 'TB-%' }
                  ]
              }
          },
          order: [['id', 'DESC']]
      });

      res.send({ results, message: 'success' });
  } catch (e) {
      res.status(500).send({ message: e.message });
  }
});
app.get('/product/listNewMachineShaftTTC', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
      const results = await ProductModel.findAll({
          limit,
          offset,
          where: {
              machine: {
                  [Op.or]: [
                      // { [Op.like]: 'TBS%' },
                      // { [Op.like]: 'TBM%' },
                      { [Op.like]: 'TTC%' },
                      // { [Op.like]: 'TCH%' },
                      // { [Op.like]: 'TB-%' }
                  ]
              }
          },
          order: [['id', 'DESC']]
      });

      res.send({ results, message: 'success' });
  } catch (e) {
      res.status(500).send({ message: e.message });
  }
});
app.get('/product/listNewMachineShaftTB', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
      const results = await ProductModel.findAll({
          limit,
          offset,
          where: {
              machine: {
                  [Op.or]: [
                      // { [Op.like]: 'TBS%' },
                      // { [Op.like]: 'TBM%' },
                      { [Op.like]: 'TB%' },
                      // { [Op.like]: 'TCH%' },
                      // { [Op.like]: 'TB-%' }
                  ]
              }
          },
          order: [['id', 'DESC']]
      });

      res.send({ results, message: 'success' });
  } catch (e) {
      res.status(500).send({ message: e.message });
  }
});
app.get('/product/listNewMachineShaftTCH', async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 200; // ดึงข้อมูลสูงสุดแค่ 200 บรรทัด

  try {
      const results = await ProductModel.findAll({
          limit,
          offset,
          where: {
              machine: {
                  [Op.or]: [
                      // { [Op.like]: 'TBS%' },
                      // { [Op.like]: 'TBM%' },
                      // { [Op.like]: 'TB%' },
                      { [Op.like]: 'TCH%' },
                      // { [Op.like]: 'TB-%' }
                  ]
              }
          },
          order: [['id', 'DESC']]
      });

      res.send({ results, message: 'success' });
  } catch (e) {
      res.status(500).send({ message: e.message });
  }
});


app.get('/product1/list', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit,
      offset
    });
    res.send({ results, totalItems, message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get('/product2/list', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get('/product2/listMachineQCSleeve', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CH%' },
                // { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
                // { [Op.like]: 'TN%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get('/product2CS/listMachineQCSleeveCS', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'CS%' },
                // { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
                // { [Op.like]: 'TN%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get('/product2SB/listMachineQCSleeveSB', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'SB%' },
                // { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
                // { [Op.like]: 'TN%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get('/product2TN/listMachineQCSleeveTN', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'CH%' },
                // { [Op.like]: 'CS%' },
                // { [Op.like]: 'SB%' },
                { [Op.like]: 'TN%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});


app.get('/product2/listMachineQCShaft', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                { [Op.like]: 'TBS%' },
                // { [Op.like]: 'TBM%' },
                // { [Op.like]: 'TTC%' },
                // { [Op.like]: 'TCH%' },
                // { [Op.like]: 'TB-%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get('/product2TBM/listMachineQCShaftTBM', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'TBS%' },
                { [Op.like]: 'TBM%' },
                // { [Op.like]: 'TTC%' },
                // { [Op.like]: 'TCH%' },
                // { [Op.like]: 'TB-%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get('/product2TTC/listMachineQCShaftTTC', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'TBS%' },
                // { [Op.like]: 'TBM%' },
                { [Op.like]: 'TTC%' },
                // { [Op.like]: 'TCH%' },
                // { [Op.like]: 'TB-%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get('/product2TCH/listMachineQCShaftTCH', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'TBS%' },
                // { [Op.like]: 'TBM%' },
                // { [Op.like]: 'TTC%' },
                { [Op.like]: 'TCH%' },
                // { [Op.like]: 'TB-%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});
app.get('/product2TB/listMachineQCShaftTB', Service.isLogin, async (req, res) => {
  try {
    const page = req.query.page || 1; // ถ้าไม่ระบุหน้าให้เริ่มที่หน้าแรก
    const limit = parseInt(req.query.limit) || 10; // กำหนดจำนวนรายการต่อหน้า ถ้าไม่ได้ระบุให้ใช้ค่าเริ่มต้นเป็น 10 รายการต่อหน้า
    const offset = (page - 1) * limit;

    const maxRows = 200; // กำหนดจำนวนบรรทัดสูงสุดที่จะดึงจากฐานข้อมูล
    const finalLimit = Math.min(limit, maxRows - offset); // จำกัดจำนวนข้อมูลที่สามารถดึงได้ตามจำนวนที่เหลือจาก maxRows
    
    ProductModel.hasMany(ProductImageModel);
    const { count: totalItems, rows: results } = await ProductModel.findAndCountAll({
      include: [{
        model: ProductImageModel,
      }],
      order: [['id', 'DESC']],
      limit: finalLimit,
      offset,
      where: {
        machine: {
            [Op.or]: [
                // { [Op.like]: 'TBS%' },
                // { [Op.like]: 'TBM%' },
                // { [Op.like]: 'TTC%' },
                // { [Op.like]: 'TCH%' },
                { [Op.like]: 'TB-%' }
            ]
        }
    },
    });

    res.send({ results, totalItems: Math.min(totalItems, maxRows), message: 'success' });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});


app.post("/product/update", Service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    // payload.userId = Service.getMemberId(req);

    await ProductModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/product/updateTimeEQM", Service.isLogin, async (req, res) => {
  try {
    const payload = req.body;

    // ✅ อัปเดตข้อมูล
    await ProductModel.update(payload, {
      where: { id: payload.id },
    });

    // ✅ ดึงข้อมูลที่อัปเดตแล้ว (optionally)
    const updatedProduct = await ProductModel.findByPk(payload.id);

    // ✅ ส่ง event ไปยังทุก client ผ่าน WebSocket
    const io = req.app.get("socketio");
    io.emit("productUpdated", updatedProduct);

    res.send({ message: "success" });
  } catch (e) {
    console.error("❌ Error in /product/update:", e);
    res.status(500).send({ message: e.message });
  }
});


app.post("/product/updateAF", Service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    // payload.userId = Service.getMemberId(req);

    await ProductModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.put("/product/updateCancel/:id", Service.isLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    const [affectedCancel] = await ProductModel.update(payload, {
      where: { id },
    });

    if (affectedCancel > 0) {
      res.send({ message: "success" });
    } else {
      res.status(404).send({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.put("/product/updateReject/:id", Service.isLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    const [affectedCancel] = await ProductModel.update(payload, {
      where: { id },
    });

    if (affectedCancel > 0) {
      res.send({ message: "success" });
    } else {
      res.status(404).send({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.put("/product/updateDetailNg/:id", Service.isLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    // ✅ สร้างสำเนาข้อมูลที่ต้องการอัปเดต
    let updateData = { ...payload };

    // ✅ ล้างค่าที่ไม่จำเป็น ถ้า contour ไม่ใช่ NG / Over / Under
    if (
      payload.contour !== "NG(Drawing)" &&
      payload.contour !== "Over target" &&
      payload.contour !== "Under target"
    ) {
      delete updateData.contour_ng_target_spec;
      delete updateData.contour_ng_drawing_spec;
      delete updateData.contour_over_target;
      delete updateData.contour_under_target;
    }

    // ✅ อัปเดตข้อมูลในฐานข้อมูล
    const [affected] = await ProductModel.update(updateData, { where: { id } });

    if (affected > 0) {
      // ✅ ดึงข้อมูลล่าสุดหลังอัปเดต
      const updatedData = await ProductModel.findByPk(id, {
        include: [{ all: true }],
      });

      // ✅ ส่ง event real-time ไป frontend ทุกเครื่อง
      const io = req.app.get("socketio");
      io.emit("productUpdated", updatedData);

      // console.log("✅ Emit productUpdated:", updatedData.id);

      res.send({ message: "success", data: updatedData });
    } else {
      res.status(404).send({ message: "ไม่พบข้อมูลสำหรับอัปเดต" });
    }
  } catch (e) {
    console.error("❌ Error updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/product/updateDetailNgSulfcom/:id", Service.isLogin, async (req, res) => {

  try {
    const id = req.params.id;
    const payload = req.body;

    // ✅ สร้างสำเนาข้อมูลที่ต้องการอัปเดต
    let updateDataSulfcom = { ...payload };

    // ✅ ล้างค่าที่ไม่จำเป็น ถ้า sulfcom ไม่ใช่ NG / Over / Under
    if (
      payload.sulfcom !== "NG(Drawing)" &&
      payload.sulfcom !== "Over target" &&
      payload.sulfcom !== "Under target"
    ) {
      delete updateDataSulfcom.sulfcom_ng_target_spec;
      delete updateDataSulfcom.sulfcom_ng_drawing_spec;
      delete updateDataSulfcom.sulfcom_over_target;
      delete updateDataSulfcom.sulfcom_under_target;
    }

    // ✅ อัปเดตข้อมูลในฐานข้อมูล
    const [affectedSulfcom] = await ProductModel.update(updateDataSulfcom, { where: { id } });

    if (affectedSulfcom > 0) {
        // ✅ ดึงข้อมูลล่าสุดหลังอัปเดต
      const updateDataSulfcom = await ProductModel.findByPk(id, {
        include: [{ all: true }],
      });

      // ✅ ส่ง event real-time ไป frontend ทุกเครื่อง
      const io = req.app.get("socketio");
      io.emit("productUpdated", updateDataSulfcom);


      res.send({ message: "success", data: updateDataSulfcom });
    } else {
      res.status(404).send({ message: "ไม่พบข้อมูลสำหรับอัปเดต" });
    }
  } catch (e) {
    console.error("❌ Error updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/product/updateDetailNgRoncom/:id", Service.isLogin, async (req, res) => {

   try {
    const id = req.params.id;
    const payload = req.body;

    // ✅ สร้างสำเนาข้อมูลที่ต้องการอัปเดต
    let updateDataRoncom = { ...payload };

    // ✅ ล้างค่าที่ไม่จำเป็น ถ้า sulfcom ไม่ใช่ NG / Over / Under
    if (
      payload.roncom !== "NG(Drawing)" &&
      payload.roncom !== "Over target" &&
      payload.roncom !== "Under target"
    ) {
      delete updateDataRoncom.roncom_ng_target_spec;
      delete updateDataRoncom.roncom_ng_drawing_spec;
      delete updateDataRoncom.roncom_over_target;
      delete updateDataRoncom.roncom_under_target;
    }

    // ✅ อัปเดตข้อมูลในฐานข้อมูล
    const [affectedRoncom] = await ProductModel.update(updateDataRoncom, { where: { id } });

    if (affectedRoncom > 0) {
      // ✅ ดึงข้อมูลล่าสุดหลังอัปเดต
      const affectedRoncom = await ProductModel.findByPk(id, {
        include: [{ all: true }],
      });

      // ✅ ส่ง event real-time ไป frontend ทุกเครื่อง
      const io = req.app.get("socketio");
      io.emit("productUpdated", affectedRoncom);


      res.send({ message: "success" , data: affectedRoncom });
    } else {
      res.status(404).send({ message: "ไม่พบข้อมูลสำหรับอัปเดต" });
    }
  } catch (e) {
    console.error("❌ Error updating product:", e);
    res.status(500).send({ message: e.message });
  }
});

app.put("/product/updateDetailNgTalysurf/:id", Service.isLogin, async (req, res) => {

   try {
    const id = req.params.id;
    const payload = req.body;

    // ✅ สร้างสำเนาข้อมูลที่ต้องการอัปเดต
    let updateDataTalysurf = { ...payload };

    // ✅ ล้างค่าที่ไม่จำเป็น ถ้า sulfcom ไม่ใช่ NG / Over / Under
    if (
      payload.talysurf !== "NG(Drawing)" &&
      payload.talysurf !== "Over target" &&
      payload.talysurf !== "Under target"
    ) {
      delete updateDataTalysurf.talysurf_ng_target_spec;
      delete updateDataTalysurf.talysurf_ng_drawing_spec;
      delete updateDataTalysurf.talysurf_over_target;
      delete updateDataTalysurf.talysurf_under_target;
    }

    // ✅ อัปเดตข้อมูลในฐานข้อมูล
    const [affectedTalysurf] = await ProductModel.update(updateDataTalysurf, { where: { id } });

    if (affectedTalysurf > 0) {
       // ✅ ดึงข้อมูลล่าสุดหลังอัปเดต
      const affectedTalysurf = await ProductModel.findByPk(id, {
        include: [{ all: true }],
      });

       // ✅ ส่ง event real-time ไป frontend ทุกเครื่อง
      const io = req.app.get("socketio");
      io.emit("productUpdated", affectedTalysurf);

      res.send({ message: "success" ,  data: affectedTalysurf });
    } else {
      res.status(404).send({ message: "ไม่พบข้อมูลสำหรับอัปเดต" });
    }
  } catch (e) {
    console.error("❌ Error updating product:", e);
    res.status(500).send({ message: e.message });
  }
});


app.post("/product2TN/addProduct", async (req, res) => {
  try {
    const newData = await ProductModel.create(req.body);

    // 🔥 ส่ง event เรียลไทม์ไป frontend
    const io = req.app.get("socketio");
    io.emit("productAdded", newData);

    res.send({ message: "success", data: newData });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "error" });
  }
});


app.post("/product/updateDetailProjector", Service.isLogin, async (req, res) => {
  try {
    let payload = req.body;

    // console.log("Payload for update:", payload);  // ตรวจสอบ payload ที่ส่งมา
     // ตรวจสอบว่ามีการส่งค่า name_qc_projector_check มาหรือไม่

     if (!payload.name_qc_projector_check || payload.name_qc_projector_check.trim() === '') {
      throw new Error("QC By off name.");
    }

    // ตรวจสอบว่าถ้าค่า contour เท่ากับ 'NG' ถึงจะทำการอัปเดต contour_ng_target_spec และ contour_ng_drawing_spec
    let updateData = { ...payload };  // คัดลอก payload
 
    await ProductModel.update(updateData, {
      where: {
        id: payload.id,
      },
    });

    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
    console.error("Error updating product:", e);  // แสดงข้อผิดพลาดที่เกิดขึ้น
  }
});

app.post('/product/barcode', Service.isLogin, async (req, res) => {
  try {
    const { barcode } = req.body; // ใช้ req.body.barcode แทน req.params.barcode
    const results = await ProductModel.findAll({
      where: {
        barcode: barcode,
      },
    });
    res.send({ results: results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
})

const { Op } = require('sequelize');

app.post("/product/ProductMC", Service.isLogin, async (req, res) => {
  try {
    const { startDate, endDate } = req.body; // ใช้ req.body.barcode แทน req.params.barcode
    const dateS = new Date(dayjs(startDate).locale("th").format("YYYY/MM/DD"));
    const dateE = new Date(dayjs(endDate+86399).locale("th").format("YYYY/MM/DD"));
    // console.log(startDate, dateS);
    const results = await ProductModel.findAll({
      where: {
        createdAt: {
          [Op.and]: [
            { [Op.gte]: dateS },
            { [Op.lte]: dateE }
          ]
        }
      },
      order: [["barcode", "DESC"]],
    });
    // console.log(results);
    res.send({ results: results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.post("/product/ProductMCQC", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    // กำหนดช่วงวันที่
    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // ค้นหาข้อมูล
    const results = await ProductModel.findAll({
      where: {
        machine: machine,
        createdAt: {
          [Op.gte]: dateS,
          [Op.lte]: dateE,
        },
      },
      order: [["id", "ASC"]], // เรียงลำดับจากเก่าสุดไปใหม่สุด
    });

    res.send({ results: results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/product/ProductMCQC_TN", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TN"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TN-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_CH", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TN"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "CH-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_TBS", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TBS"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TBS-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_TBM", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TBM"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TBM-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_TTC", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TTC"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TTC-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_TCH", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TCH"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TCH-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
app.post("/product/ProductMCQC_TB", Service.isLogin, async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.body;

    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    // 🔹 ถ้ามี machine ให้ค้นหาเฉพาะเครื่องนั้น
    // 🔹 ถ้าไม่มี ให้ค้นหาเครื่องที่ขึ้นต้นด้วย "TCH"
    const whereCondition = {
      createdAt: {
        [Op.gte]: dateS,
        [Op.lte]: dateE,
      },
      ...(machine
        ? { machine: machine }
        : { machine: { [Op.like]: "TB-%" } }),
    };

    const results = await ProductModel.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});



app.post('/product/searchData', Service.isLogin, async (req, res) => {
  try {
    const { startDate, endDate, machine } = req.body; // ใช้ req.body.startDate, req.body.endDate, req.body.machine
    const results = await ProductModel.findAll({
      where: {
        // แก้เป็นเงื่อนไขการค้นหาด้วย Start Date, End Date, และ Machine
        createdAt: {
          [Op.between]: [startDate, endDate] // ให้ปรับตาม field ที่เก็บข้อมูลวันที่เป็นต้องการ
        },
        machine: machine // ให้ปรับตาม field ที่เก็บข้อมูลเครื่องจักร
      },
    });
    res.send({ results: results, message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
})



ProductModel.hasMany(ProductImageModel, { foreignKey: "productId" });
ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId" });

ProductModel.hasMany(ProductInputSpecModel, { foreignKey: "productId" });
ProductInputSpecModel.belongsTo(ProductModel, { foreignKey: "productId" });

app.post("/product/listRecord", Service.isLogin, async (req, res) => {

   // ตรวจสอบว่ามีการรับค่าจาก req.body หรือไม่
   const { startDate, endDate } = req.body;

   // ตรวจสอบว่ามีค่า startDate และ endDate ถูกต้อง
   if (!startDate || !endDate) {
     return res.status(400).send({ message: "Please provide both startDate and endDate." });
   }

  try {
    const results = await ProductModel.findAll({
      include: [
        {
          model: ProductImageModel,
          required: false, // ถ้า required: true จะทำให้เป็น inner join; ถ้า false จะเป็น left join
        },
      ],

      where: {
        createdAt: {
          [Op.between]: [startDate, endDate] // กำหนดช่วงวันที่จาก startDate และ endDate
        }
      },
      order: [["id", "DESC"]], // เรียงลำดับจากล่าสุดไปเก่าสุด
    });

    res.send({ results, message: "success" });
    // console.log(results);
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/product/listRecordNew", Service.isLogin, async (req, res) => {
  const { startDate, endDate } = req.body;

  // ตั้งค่า startDate เป็นเวลาเริ่มต้นของวัน
  const dateS = new Date(startDate);
  // ตั้งค่า endDate เป็นเวลา 23:59:59 ของวันสิ้นสุด
  const dateE = new Date(new Date(endDate).setHours(23, 59, 59));

  if (!startDate || !endDate) {
    return res.status(400).send({ message: "Please provide both startDate and endDate." });
  }

  try {
    const results = await ProductModel.findAll({
      include: [
        {
          model: ProductImageModel,
          required: false, // ใช้ left join
        },
      ],
      where: {
        createdAt: {
          [Op.and]: [
            { [Op.gte]: dateS }, // เงื่อนไขเวลาสำหรับวันที่เริ่มต้น
            { [Op.lte]: dateE }  // เงื่อนไขเวลาสำหรับวันที่สิ้นสุด
          ]
        }
      },
      order: [["id", "DESC"]],
    });

    res.send({ results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// app.post("/product/listRecordWithSpec", Service.isLogin, async (req, res) => {
//   const { startDate, endDate } = req.body;

//   if (!startDate || !endDate) {
//     return res.status(400).send({ message: "Please provide both startDate and endDate." });
//   }

//   try {
//     const dateS = new Date(startDate);
//     const dateE = new Date(new Date(endDate).setHours(23, 59, 59));

//     const results = await ProductModel.findAll({
//       include: [
//           {
//               model: ProductImageModel,
//               required: false,
//           },
//           {
//               model: ProductInputSpecModel,
//               required: false,
//           },
//       ],
//       where: {
//           createdAt: {
//               [Op.and]: [
//                   { [Op.gte]: dateS },
//                   { [Op.lte]: dateE },
//               ],
//           },
//       },
//       order: [["id", "DESC"]],
//   });
  
//   res.send({ results: results.map(result => result.toJSON()), message: "success" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send({ message: e.message });
//   }
// });

app.post("/product/listRecordWithSpec", Service.isLogin, async (req, res) => {
  const { startDate, endDate, machineFilter } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).send({ message: "Please provide both startDate and endDate." });
  }
  try {
    // กำหนดช่วงวันที่
    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    const whereConditions = {
      createdAt: {
        [Op.and]: [
          { [Op.gte]: dateS },
          { [Op.lte]: dateE },
        ],
      },
    };

    // ถ้ามีการเลือกเครื่องให้กรองด้วย
    if (machineFilter) {
      whereConditions.machine = machineFilter;
    }

    const results = await ProductModel.findAll({
      include: [
        {
          model: ProductImageModel,
          required: false,
        },
        {
          model: ProductInputSpecModel,
          required: false,
        },
      ],
      where: whereConditions,
      order: [["id", "DESC"]],
    });

    res.send({ results: results.map(result => result.toJSON()), message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
});



// helper คอลัมน์ t1..t42
const toolCols = Array.from({ length: 42 }, (_, i) => `t${i + 1}`);

// คอลัมน์ที่ต้องการจากตาราง products เท่านั้น
const baseCols = [
  'id', 'barcode', 'createdAt', 'name', 'shift', 'machine', 'model', 'process', 'remark',
  'afterset', 'nameafterset',
  'afterset2', 'nameafterset2',
  'afterset3', 'nameafterset3',
  'afterset4', 'nameafterset4',
  'afterset5', 'nameafterset5',
  'tool_change_case',
  'contour_ng_target_spec', 'contour_ng_drawing_spec', 'contour_over_target', 'contour_under_target',
  'sulfcom_ng_target_spec', 'sulfcom_ng_drawing_spec', 'sulfcom_over_target', 'sulfcom_under_target',
  'roncom_ng_target_spec', 'roncom_ng_drawing_spec', 'roncom_over_target', 'roncom_under_target',
  'talysurf_ng_target_spec', 'talysurf_ng_drawing_spec', 'talysurf_over_target', 'talysurf_under_target'
];


app.post("/product/listCaseToolNG", Service.isLogin, async (req, res) => {
  const { startDate, endDate, machineFilter } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).send({ message: "Please provide both startDate and endDate." });
  }

  try {
    const dateS = new Date(`${startDate}T00:00:00`);
    const dateE = new Date(`${endDate}T23:59:59`);

    const whereConditions = {
      createdAt: { [Op.gte]: dateS, [Op.lte]: dateE },
      ...(machineFilter ? { machine: machineFilter } : {})
    };

    const results = await ProductModel.findAll({
      attributes: [...baseCols, ...toolCols], // ✅ เลือกเฉพาะคอลัมน์
      where: whereConditions,
      order: [["id", "DESC"]],
      // ✅ ไม่มี include / join
    });

    res.send({ results: results.map(r => r.toJSON()), message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
});



app.post('/api/getChartData', async (req, res) => {
  const { startDate, endDate, mcType } = req.body;

  try {
    // console.log("Request Data:", { startDate, endDate, mcType });

    const results = await ProductModel.findAll({
      where: {
        machine: {
          [Op.like]: `${mcType}%`,
        },
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      attributes: ['model', 'createdAt', 'machine'],
      order: [['createdAt', 'ASC']],
    });

    // Format data before sending it to the frontend
    const formattedResults = results.map((result) => ({
      model: result.model,
      machine: parseInt(result.machine.split("-")[1]), // แยกตัวเลขจาก "CH-01"
      createdAt: result.createdAt.toISOString().split("T")[0],
    }));

    // console.log("Query Results:", formattedResults);
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});


app.post("/api/getChartData", async (req, res) => {
  const { startDate, endDate, mcType } = req.body;

  if (!mcType) {
    return res.status(400).json({ error: "mcType is required" });
  }

  const start = startDate ? new Date(startDate) : new Date("2024-01-01");
  const end = endDate ? new Date(endDate) : new Date();

  try {
    const results = await ProductModel.findAll({
      where: {
        machine: {
          [Op.like]: `${mcType}%`, // ใช้ mcType
        },
        date_qc_by_off: {
          [Op.between]: [start, end], // ใช้ช่วงเวลา
        },
      },
      attributes: [
        "model",
        [sequelize.fn("COUNT", sequelize.col("machine")), "machineCount"], // นับจำนวนเครื่อง
      ],
      group: ["model"], // รวมตาม model
      order: [["machineCount", "DESC"]], // เรียงจากมากไปน้อย
    });
    
    // console.log("Query Results:", results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ error: "Error fetching graph data" });
  }
});


module.exports = app;