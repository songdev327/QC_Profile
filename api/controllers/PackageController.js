const express = require('express')
const app = express()
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');

app.get('/package/list', async(req, res) => {
    try {
    const results = await PackageModel.findAll({
        order: ['name']
    });
       res.send({results: results});
    } catch (e) {
        res.statusCode(500).send({ message: e.message });
    }
});

app.get("/package/getPackageRegister", async (req, res) => {
  try {
    const results = await PackageModel.findAll({
      order: ["name"],
    });
    res.send({ results: results });
  } catch (e) {
    res.statusCode(500).send({ message: e.message });
  }
});
``
app.post('/package/memberRegister', async(req, res) => {
    try {
         const result = await MemberModel.create(req.body);
         res.send({message: 'success', result: result});
    }catch (e) {
        res.send({message: e.message});
    }
})

app.put('/package/memberUpdate/:id', async(req, res) => {
  try {
      const id = req.params.id;

      // console.log("Updating member with ID:", id);

      const result = await MemberModel.update(req.body, {
          where: { id: id }  // ค้นหาข้อมูลสมาชิกด้วย id ที่ส่งมา
      });

      if (result[0] === 0) {  // ถ้าไม่มีข้อมูลที่อัปเดตได้
          res.send({message: 'ไม่พบข้อมูลที่ต้องการอัปเดต'});
      } else {
          res.send({message: 'success'});
      }
  } catch (e) {
      res.send({message: e.message});
  }
});

module.exports = app;