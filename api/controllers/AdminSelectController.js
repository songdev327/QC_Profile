const express = require("express");
const app = express();
const MemberModel = require("../models/MemberModel");
const ProductModel = require("../models/ProductModel");
const ProductImageModel = require("../models/ProductImageModel")
const { QueryTypes, Op } = require("sequelize");
const conn = require('../connect'); // ✅ เพิ่มไว้ด้านบนของไฟล์
const { fn, col, literal } = require('sequelize');


app.post('/checkTotalUsersBymachine', async (req, res) => {
  try {
    //   const totalUsers = await MemberModel.count(); // ใช้ Sequelize ORM
    const totalUsers = await MemberModel.count({ col: 'id' }); // ✅ ระบุให้ชัดว่าคือนับ id
    res.json({ totalUsers });
  } catch (error) {
    // console.error('Error fetching total users:', error);
    res.status(500).json({ error: 'Failed to fetch total users' });
  }
});


app.post('/checkTotalRequestByMachine', async (req, res) => {
    try {
        const { machineType, month } = req.body;
        const machinePrefix = machineType.split('-')[0];

        let startDate, endDate;

        if (month) {
            const [year, mon] = month.split('-');
            startDate = new Date(parseInt(year), parseInt(mon) - 1, 1);
            endDate = new Date(parseInt(year), parseInt(mon), 0, 23, 59, 59);
        } else {
            const now = new Date();
            const year = now.getFullYear();
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59);
        }

        const baseFilter = {
            machine: { [Op.like]: `${machinePrefix}%` },
            createdAt: { [Op.between]: [startDate, endDate] }
        };

        const totalChange = await ProductModel.count({ where: baseFilter });

        const finish = await ProductModel.count({ where: { ...baseFilter, barcode: "Pass" } });
        const cancel = await ProductModel.count({ where: { ...baseFilter, barcode: "Cancel" } });
        const reject = await ProductModel.count({ where: { ...baseFilter, barcode: "Reject" } });
        const in_progress = await ProductModel.count({
            where: {
                ...baseFilter,
                barcode: { [Op.notIn]: ["Pass", "Cancel", "Reject"] }
            }
        });

        res.json({ totalChange, finish, cancel, reject, in_progress });

    } catch (error) {
        console.error("❌ Error fetching total requests:", error);
        res.status(500).json({ error: "Failed to fetch total requests" });
    }
});



const Sequelize = require("sequelize");  // ✅ เพิ่มบรรทัดนี้

// app.post('/getMonthlyChangeData', async (req, res) => {
//     const { machineType } = req.body;

//     try {
//         const machinePrefix = `${machineType}%`;

//         // ✅ กำหนดช่วงวันที่ของ "ปีปัจจุบัน"
//         const now = new Date();
//         const currentYear = now.getFullYear();
//         const startOfYear = new Date(currentYear, 0, 1);  // 1 ม.ค.
//         const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);  // 31 ธ.ค.

//         const records = await ProductModel.findAll({
//             where: {
//                 machine: {
//                     [Op.like]: machinePrefix
//                 },
//                 createdAt: {
//                     [Op.between]: [startOfYear, endOfYear]  // ✅ กรองเฉพาะปีปัจจุบัน
//                 }
//             },
//             attributes: [
//                 [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
//                 [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']
//             ],
//             group: ['month'],
//             order: [[Sequelize.fn('to_char', Sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
//             raw: true
//         });

//         res.json(records);
//     } catch (error) {
//         console.error('❌ Error fetching monthly data:', error);
//         res.status(500).json({ error: 'Failed to fetch monthly data' });
//     }
// });

app.post('/getMonthlyChangeData', async (req, res) => {
  const { machineType, year } = req.body;

  try {
    const machinePrefix = `${machineType}%`;

    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    const startOfYear = new Date(y, 0, 1);
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);

    const records = await ProductModel.findAll({
      where: {
        machine: { [Op.like]: machinePrefix },
        createdAt: { [Op.between]: [startOfYear, endOfYear] }
      },
      attributes: [
        [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']
      ],
      group: ['month'],
      order: [[Sequelize.fn('to_char', Sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
      raw: true
    });

    res.json(records);
  } catch (error) {
    console.error('❌ Error fetching monthly data:', error);
    res.status(500).json({ error: 'Failed to fetch monthly data' });
  }
});



// routes/statistics.js หรือที่ใช้อยู่
// app.post('/getSetterChangeStats', async (req, res) => {
//   try {
//     const { machineType, month } = req.body;
//     const [year, monthNum] = month.split('-');

//     const startDate = new Date(year, parseInt(monthNum) - 1, 1);
//     const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

//     const result = await ProductModel.findAll({
//       attributes: [
//         'name', // ✅ ใช้ name ที่เป็น Setter เท่านั้น
//         [fn('COUNT', col('id')), 'totalChanges'],
//         [fn('SUM', literal(`CASE WHEN afterset IS NOT NULL THEN 1 ELSE 0 END`)), 'afterSetCount'],
//       ],
//       where: {
//         machine: { [Op.like]: `${machineType}%` },
//         createdAt: { [Op.between]: [startDate, endDate] },
//       },
//       group: ['name'],
//       raw: true,
//     });

//     const final = result.map(item => {
//       const total = parseInt(item.totalChanges);
//       const after = parseInt(item.afterSetCount);
//       return {
//         name: item.name || 'N/A',
//         afterset: after,
//         total: total,
//         percent: total ? Math.round((after / total) * 100) : 0,
//       };
//     });

//     final.sort((a, b) => b.total - a.total);

//     res.json(final);

//   } catch (error) {
//     console.error("❌ Error in getSetterChangeStats:", error);
//     res.status(500).json({ error: "Failed to fetch setter change stats" });
//   }
// });


app.post('/getSetterChangeStats', async (req, res) => {
  try {
    const { machineType, month } = req.body;
    const [year, monthNum] = month.split('-');

    const startDate = new Date(year, parseInt(monthNum) - 1, 1);
    const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

    const result = await ProductModel.findAll({
      attributes: [
        'name', // ✅ ใช้ name ที่เป็น Setter เท่านั้น
        [fn('COUNT', col('id')), 'totalChanges'],
        [
          fn(
            'SUM',
            literal(`CASE WHEN afterset = 'AF1' THEN 1 ELSE 0 END`)
          ),
          'afterSetCount',
        ],
      ],
      where: {
        machine: { [Op.like]: `${machineType}%` },
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      group: ['name'],
      raw: true,
    });

    const final = result.map(item => {
      const total = parseInt(item.totalChanges);
      const after = parseInt(item.afterSetCount);
      return {
        name: item.name || 'N/A',
        afterset: after,
        total: total,
        percent: total ? Math.round((after / total) * 100) : 0,
      };
    });

    final.sort((a, b) => b.total - a.total);

    res.json(final);

  } catch (error) {
    console.error("❌ Error in getSetterChangeStats:", error);
    res.status(500).json({ error: "Failed to fetch setter change stats" });
  }
});


app.post('/getChangeToolList', async (req, res) => {
  const { machineType, month } = req.body;

  try {
    const rows = await conn.query(
      `
      SELECT barcode, name, shift, machine, model, process, tool_change_case , 
      afterset , nameafterset , afterset2 , nameafterset2 , 
      afterset3 , nameafterset3 , afterset4 , nameafterset4 , afterset5 , nameafterset5, 
      "createdAt" AS "createdAt"  -- ✅ เพิ่มตรงนี้
      FROM products
      WHERE machine LIKE :machinePrefix
        AND TO_CHAR("createdAt", 'YYYY-MM') = :month
      ORDER BY "createdAt" DESC
      `,
      {
        replacements: {
          machinePrefix: `${machineType}%`,
          month: month
        },
        type: conn.QueryTypes.SELECT
      }
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error in /getChangeToolList:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/getSetterToolList', async (req, res) => {
  const { machineType, month, setterName } = req.body;
  const [year, monthNum] = month.split('-');

  const startDate = new Date(year, parseInt(monthNum) - 1, 1);
  const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

  try {
    const records = await ProductModel.findAll({
      where: {
        machine: { [Op.like]: `${machineType}-%` },
        name: setterName,
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    res.json(records);
  } catch (err) {
    console.error("❌ Error in /getSetterToolList:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});



module.exports = app;