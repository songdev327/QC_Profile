const express = require("express");
const app = express();
const MemberModel = require("../models/MemberModel");
const ProductModel = require("../models/ProductModel");
const ProductImageModel = require("../models/ProductImageModel")
const { QueryTypes } = require("sequelize");



app.post('/checkTotalUsers', async (req, res) => {
  try {
    //   const totalUsers = await MemberModel.count(); // ใช้ Sequelize ORM
    const totalUsers = await MemberModel.count({ col: 'id' }); // ✅ ระบุให้ชัดว่าคือนับ id
    res.json({ totalUsers });
  } catch (error) {
    // console.error('Error fetching total users:', error);
    res.status(500).json({ error: 'Failed to fetch total users' });
  }
});

app.post('/checkTotalRequest', async (req, res) => {
  try {
    const totalChange = await ProductModel.count();

    const finish = await ProductModel.count({ where: { barcode: "Pass" } });
    const cancel = await ProductModel.count({ where: { barcode: "Cancel" } });
    const reject = await ProductModel.count({ where: { barcode: "Reject" } });

    const in_progress = await ProductModel.count({
      where: {
        barcode: {
          [Op.notIn]: ["Pass", "Cancel", "Reject"]
        }
      }
    });

    res.json({
      totalChange,
      finish,
      cancel,
      reject,
      in_progress
    });
  } catch (error) {
    // console.error("❌ Error fetching total requests:", error);
    res.status(500).json({ error: "Failed to fetch total requests" });
  }
});

// controllers/admincontroller.js หรือไฟล์ backend ที่เกี่ยวข้อง
app.post('/getDailyRequests', async (req, res) => {
  try {
    const { Op, literal } = require("sequelize");
    const ProductModel = require("../models/ProductModel");

    const result = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'date'],
        [literal('COUNT(id)'), 'quantity'],
        [literal(`SUM(CASE WHEN finished = true THEN 1 ELSE 0 END)`), 'finish'],
        [literal(`SUM(CASE WHEN finished = false THEN 1 ELSE 0 END)`), 'in_progress']
      ],
      group: [literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`)],
      order: [[literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'ASC']],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const chartData = result.map(row => {
      const date = row.dataValues.date;
      const dateObj = new Date(date);
      return {
        name: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        quantity: parseInt(row.dataValues.quantity || 0),
        finish: parseInt(row.dataValues.finish || 0),
        in_progress: parseInt(row.dataValues.in_progress || 0)
      };
    });

    // console.log("📊 dailyRequests >>", chartData);
    res.json({ dailyRequests: chartData });
  } catch (err) {
    // console.error("❌ Error in /getDailyRequests:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/getAvailableYears', async (req, res) => {
  try {
    const { literal } = require("sequelize");

    const results = await ProductModel.findAll({
      attributes: [
        [literal(`DISTINCT EXTRACT(YEAR FROM "createdAt")`), 'year']
      ],
      order: [[literal(`year`), 'ASC']]
    });

    const years = results.map(r => parseInt(r.dataValues.year));
    res.json({ years });
  } catch (err) {
    // console.error("❌ Error in /getAvailableYears:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});


const { Op, fn, col, literal, where, Sequelize } = require("sequelize");
const { constants } = require("fs-extra");
const sequelize = require("../models/ProductModel").sequelize; // ✅ เพิ่มบรรทัดนี้

app.post('/getMonthlyRequests', async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'FMMonth')`), 'name'],
        [fn('COUNT', col('id')), 'value']
      ],
      group: [literal(`TO_CHAR("createdAt", 'FMMonth')`)],
      order: [fn('MIN', col('createdAt'))]
    });

    res.json({ monthlyRequests: results });
  } catch (error) {
    // console.error("❌ Error fetching monthly request data:", error);
    // console.error(error); // เพิ่มบรรทัดนี้
    res.status(500).json({ error: "Failed to fetch monthly request data" });
  }
});

app.post('/getMonthlyRequestsNew', async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'YYYY-MM')`), 'month'], // ✅ เปลี่ยนเป็นปี-เดือน
        [fn('COUNT', col('id')), 'total'],
        [fn('SUM', literal(`CASE WHEN barcode = 'Pass' THEN 1 ELSE 0 END`)), 'pass'],
        [fn('SUM', literal(`CASE WHEN barcode = 'Cancel' THEN 1 ELSE 0 END`)), 'cancel'],
        [fn('SUM', literal(`CASE WHEN barcode = 'Reject' THEN 1 ELSE 0 END`)), 'reject']
      ],
      group: [literal(`TO_CHAR("createdAt", 'YYYY-MM')`)],
      order: [literal(`TO_CHAR("createdAt", 'YYYY-MM')`)] // ✅ เรียงลำดับเวลา
    });

    const formatted = results.map(row => ({
      month: row.dataValues.month,
      total: parseInt(row.dataValues.total),
      pass: parseInt(row.dataValues.pass),
      cancel: parseInt(row.dataValues.cancel),
      reject: parseInt(row.dataValues.reject)
    }));

    res.json({ monthlyRequests: formatted });
  } catch (error) {
    // console.error("❌ Error fetching monthly request data:", error);
    res.status(500).json({ error: "Failed to fetch monthly request data" });
  }
});


// ✅ routes: getYearlyRequests
app.post('/getYearlyRequests', async (req, res) => {
  try {
    const { literal } = require("sequelize");
    const result = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'YYYY')`), 'year'],
        [literal('COUNT(id)'), 'value']
      ],
      group: [literal(`TO_CHAR("createdAt", 'YYYY')`)],
      order: [[literal(`TO_CHAR("createdAt", 'YYYY')`), 'ASC']]
    });

    const data = result.map(row => ({
      name: row.dataValues.year,
      value: parseInt(row.dataValues.value || 0)
    }));

    res.json({ yearlyRequests: data });
  } catch (error) {
    // console.error("❌ Error in /getYearlyRequests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/getDailyAFxAll', async (req, res) => {
  try {
    const { Op, literal } = require("sequelize");

    const results = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'date'],
        'afterset',
        'nameafterset',
        'machine'
      ],
      where: {
        afterset: {
          [Op.in]: ['AF1', 'AF2', 'AF3', 'AF4', 'AF5', 'AF6', 'AF7']
        },
        createdAt: {
          [Op.not]: null
        }
      },
      order: [[literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'ASC']]
    });

    const data = results.map(r => ({
      date: r.dataValues.date,
      machine: r.dataValues.machine,
      afterset: r.dataValues.afterset,
      nameafterset: r.dataValues.nameafterset
    }));

    res.json({ afxRaw: data });
  } catch (err) {
    // console.error("❌ Error fetching AFx data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/getDailyAftersetSummary', async (req, res) => {
  try {
    const { Op, literal, fn, col } = require("sequelize");

    const results = await ProductModel.findAll({
      attributes: [
        [literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'date'],
        [fn('COUNT', col('afterset')), 'count']
      ],
      where: {
        afterset: {
          [Op.in]: ['AF1', 'AF2', 'AF3', 'AF4', 'AF5', 'AF6', 'AF7']
        },
        createdAt: {
          [Op.not]: null
        }
      },
      group: [literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`)],
      order: [[literal(`TO_CHAR("createdAt", 'YYYY-MM-DD')`), 'ASC']]
    });

    const data = results.map(row => ({
      name: row.dataValues.date,
      value: parseInt(row.dataValues.count)
    }));

    res.json({ aftersetSummary: data });
  } catch (err) {
    // console.error("❌ Error fetching afterset summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post('/getAftersetBySetter', async (req, res) => {
  try {
    // 🔹 ดึง nameafterset จาก ProductModel
    const productResults = await ProductModel.findAll({
      attributes: [
        'nameafterset',
        [fn('COUNT', col('nameafterset')), 'count']
      ],
      where: {
        afterset: {
          [Op.in]: ['AF1', 'AF2', 'AF3', 'AF4', 'AF5']
        },
        nameafterset: { [Op.ne]: null }
      },
      group: ['nameafterset']
    });

    // 🔹 ดึง nameafterset จาก ProductImageModel
    const imageResults = await ProductImageModel.findAll({
      attributes: [
        'nameafterset',
        [fn('COUNT', col('nameafterset')), 'count']
      ],
      where: {
        afterset: {
          [Op.in]: ['AF1', 'AF2', 'AF3', 'AF4', 'AF5']
        },
        nameafterset: { [Op.ne]: null }
      },
      group: ['nameafterset']
    });

    // 🔹 รวมข้อมูล 2 ชุด
    const countMap = {};

    [...productResults, ...imageResults].forEach(entry => {
      const name = entry.nameafterset;
      const count = parseInt(entry.dataValues.count);

      if (countMap[name]) {
        countMap[name] += count;
      } else {
        countMap[name] = count;
      }
    });

    // 🔹 แปลงกลับเป็น array สำหรับกราฟ
    const formatted = Object.keys(countMap).map(name => ({
      name,
      value: countMap[name]
    }));

    res.json({ data: formatted });
  } catch (err) {
    // console.error("❌ Error in /getAftersetBySetter:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post('/getAftersetBySetterNew', async (req, res) => {
//   try {
//     const { machineType } = req.body;
//     const machinePrefix = machineType || 'CH-'; // ✅ ยังคงใช้ตรงนี้

//     const results = await ProductModel.findAll({
//       attributes: [
//         'nameafterset', 'nameafterset2', 'nameafterset3',
//         'nameafterset4', 'nameafterset5', 'createdAt', 'machine'
//       ],
//       where: {
//         machine: {
//           [Op.startsWith]: machinePrefix  // ✅ ใช้ machinePrefix ตรงนี้เสมอ
//         },
//         [Op.or]: [
//           { afterset: 'AF1' },
//           { afterset2: 'AF2' },
//           { afterset3: 'AF3' },
//           { afterset4: 'AF4' },
//           { afterset5: 'AF5' }
//         ]
//       }
//     });

//     const groupedData = {};

//     results.forEach(row => {
//       const dateStr = new Date(row.createdAt).toISOString().split('T')[0];
//       const nameFields = [
//         row.nameafterset,
//         row.nameafterset2,
//         row.nameafterset3,
//         row.nameafterset4,
//         row.nameafterset5
//       ];

//       nameFields.forEach(name => {
//         if (name) {
//           const key = `${dateStr}__${name}`;
//           groupedData[key] = (groupedData[key] || 0) + 1;
//         }
//       });
//     });

//     const formatted = Object.entries(groupedData).map(([key, value]) => {
//       const [date, name] = key.split('__');
//       const matchingRow = results.find(r =>
//         r.createdAt.toISOString().split('T')[0] === date &&
//         [r.nameafterset, r.nameafterset2, r.nameafterset3, r.nameafterset4, r.nameafterset5].includes(name)
//       );

//       const machine = matchingRow?.machine || null;

//       return { date, name, value, machine };
//     });

//     res.json({ data: formatted });

//   } catch (err) {
//     console.error("❌ Error in /getAftersetBySetterNew:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post('/getAftersetBySetterNew', async (req, res) => {
  try {
    const { machineType } = req.body;
    const machinePrefix = machineType || 'CH-';

    const results = await ProductModel.findAll({
      attributes: [
        'createdAt',
        'machine',
        'model',
        'name', // คนเริ่มต้นเปลี่ยน T Number
        'nameafterset', 'nameafterset2', 'nameafterset3', 'nameafterset4', 'nameafterset5'
      ],
      where: {
        machine: {
          [Op.startsWith]: machinePrefix
        },
        [Op.or]: [
          { afterset: 'AF1' },
          { afterset2: 'AF2' },
          { afterset3: 'AF3' },
          { afterset4: 'AF4' },
          { afterset5: 'AF5' }
        ]
      }
    });

    const finalResult = [];

    results.forEach(row => {
      const dateStr = new Date(row.createdAt).toISOString().split('T')[0];
      const afMap = [
        { name: row.nameafterset, af: 'AF1' },
        { name: row.nameafterset2, af: 'AF2' },
        { name: row.nameafterset3, af: 'AF3' },
        { name: row.nameafterset4, af: 'AF4' },
        { name: row.nameafterset5, af: 'AF5' }
      ];

      afMap.forEach(item => {
        if (item.name) {
          finalResult.push({
            date: dateStr,
            machine: row.machine,
            model: row.model || null,
            nameChange: row.name || null,
            name: item.name,
            af: item.af,
            value: 1
          });
        }
      });
    });

    res.json({ data: finalResult });
  } catch (err) {
    // console.error("❌ Error in /getAftersetBySetterNew:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/getAftersetBySetterNew1', async (req, res) => {
  try {
    const { machineType } = req.body;
    const machinePrefix = machineType || 'CH-';

    const results = await ProductModel.findAll({
      attributes: [
        'createdAt',
        'machine',
        'model',
        'name', // 👈 คนเริ่มต้นเปลี่ยน T Number
        'nameafterset',
        'nameafterset2',
        'nameafterset3',
        'nameafterset4',
        'nameafterset5'
      ],
      where: {
        machine: {
          [Op.startsWith]: machinePrefix
        },
        [Op.or]: [
          { afterset: 'AF1' },
          { afterset2: 'AF2' },
          { afterset3: 'AF3' },
          { afterset4: 'AF4' },
          { afterset5: 'AF5' }
        ]
      }
    });

    const finalResult = [];

    results.forEach(row => {
      const dateStr = new Date(row.createdAt).toISOString().split('T')[0];
      const afMap = [
        { name: row.nameafterset, af: 'AF1' },
        { name: row.nameafterset2, af: 'AF2' },
        { name: row.nameafterset3, af: 'AF3' },
        { name: row.nameafterset4, af: 'AF4' },
        { name: row.nameafterset5, af: 'AF5' }
      ];

      afMap.forEach(item => {
        if (item.name) {
          finalResult.push({
            date: dateStr,
            machine: row.machine,
            model: row.model || null,
            nameChange: row.name || null,
            name: item.name,
            af: item.af,
            value: 1
          });
        }
      });
    });

    res.json({ data: finalResult });
  } catch (err) {
    // console.error("❌ Error in /getAftersetBySetterNew1:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.post('/getAftersetBySetterCause', async (req, res) => {
//   try {
//     const { machineType } = req.body;
//     const machinePrefix = machineType || ''; // ถ้าไม่ส่งมาเลย จะไม่กรอง

//     const results = await ProductModel.findAll({
//       attributes: [
//         'name', 'createdAt', 'machine', 'model',
//         'afterset', 'afterset2', 'afterset3', 'afterset4', 'afterset5',
//         'nameafterset', 'nameafterset2', 'nameafterset3', 'nameafterset4', 'nameafterset5'
//       ],
//       where: {
//         name: { [Op.ne]: null },
//         machine: {
//           [Op.startsWith]: machinePrefix
//         }
//       }
//     });

//     const grouped = {};

//     results.forEach(row => {
//       const person = row.name;
//       const afs = [
//         { af: row.afterset, nameAfter: row.nameafterset, label: 'AF1' },
//         { af: row.afterset2, nameAfter: row.nameafterset2, label: 'AF2' },
//         { af: row.afterset3, nameAfter: row.nameafterset3, label: 'AF3' },
//         { af: row.afterset4, nameAfter: row.nameafterset4, label: 'AF4' },
//         { af: row.afterset5, nameAfter: row.nameafterset5, label: 'AF5' },
//       ];

//       afs.forEach(item => {
//         if (item.af && ['AF1', 'AF2', 'AF3', 'AF4', 'AF5'].includes(item.af)) {
//           if (!grouped[person]) {
//             grouped[person] = {
//               name: person,
//               value: 0,
//               machine: row.machine, // ✅ เพิ่มตรงนี้
//               details: []
//             };
//           }

//           grouped[person].value += 1;

//           grouped[person].details.push({
//             date: row.createdAt,
//             machine: row.machine,
//             model: row.model,
//             af: item.label,
//             nameAfter: item.nameAfter
//           });
//         }
//       });
//     });

//     const result = Object.values(grouped);
//     res.json({ data: result });

//   } catch (err) {
//     console.error("❌ Error in /getAftersetBySetterCause:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


app.post('/getAftersetBySetterCause', async (req, res) => {
  try {
    const { machineType, month, year, model } = req.body;
    const machinePrefix = machineType || '';
    const selectedMonth = month || (new Date().getMonth() + 1);

    const results = await ProductModel.findAll({
      attributes: [
        'name', 'createdAt', 'machine', 'model', 'barcode',
        'afterset', 'afterset2', 'afterset3', 'afterset4', 'afterset5',
        'nameafterset', 'nameafterset2', 'nameafterset3', 'nameafterset4', 'nameafterset5'
      ],
      where: {
        name: { [Op.ne]: null },
        machine: { [Op.startsWith]: machinePrefix },
        barcode: 'Pass',
        ...(model && { model }), // ✅ เพิ่มตรงนี้ให้กรอง model ถ้ามีส่งมา
        [Op.and]: [
          sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "createdAt"')), selectedMonth),
          sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "createdAt"')), year)
        ]
      }
    });

    const grouped = {};

    results.forEach(row => {
      const person = row.name;

      const afs = [
        { af: row.afterset, nameAfter: row.nameafterset, label: 'AF1' },
        { af: row.afterset2, nameAfter: row.nameafterset2, label: 'AF2' },
        { af: row.afterset3, nameAfter: row.nameafterset3, label: 'AF3' },
        { af: row.afterset4, nameAfter: row.nameafterset4, label: 'AF4' },
        { af: row.afterset5, nameAfter: row.nameafterset5, label: 'AF5' },
      ];

      if (!grouped[person]) {
        grouped[person] = {
          name: person,
          value: 0,
          machine: row.machine,
          details: [],
          changeRowSet: new Set()  // ✅ สำหรับนับแถวที่ไม่ซ้ำ
        };
      }

      afs.forEach(item => {
        if (item.af && ['AF1', 'AF2', 'AF3', 'AF4', 'AF5'].includes(item.af)) {
          grouped[person].value += 1;

          grouped[person].details.push({
            date: row.createdAt,
            machine: row.machine,
            model: row.model,
            af: item.label,
            nameAfter: item.nameAfter,
            nameChange: person
          });

          // // ✅ เก็บ createdAt เป็นตัวระบุ "การเปลี่ยน" ไม่ให้เบิ้ล
          // grouped[person].changeRowSet.add(row.createdAt.toISOString());
        }
      });
      // ✅ นับเฉพาะ barcode = 'Pass' เท่านั้น
      if (row.barcode === 'Pass') {
        grouped[person].changeRowSet.add(row.createdAt.toISOString());
      }
    });

    const result = Object.values(grouped).map(person => ({
      ...person,
      totalChanges: person.changeRowSet.size  // ✅ เพิ่มจำนวนครั้งเปลี่ยนที่ไม่ซ้ำ
    }));

    res.json({ data: result });

  } catch (err) {
    // console.error("❌ Error in /getAftersetBySetterCause:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/getAvailableYearsAdd', async (req, res) => {
  try {
    const { literal } = require("sequelize");

    const results = await ProductModel.findAll({
      attributes: [
        [literal(`DISTINCT EXTRACT(YEAR FROM "createdAt")`), 'year']
      ],
      order: [[literal(`year`), 'ASC']]
    });

    const years = results.map(r => parseInt(r.dataValues.year));
    res.json({ years });
  } catch (err) {
    // console.error("❌ Error in /getAvailableYears:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

// ---- Start Old ok ------------------------

// app.post('/getSetterChangeStacked', async (req, res) => {
//   try {
//     const { machineType, month, year, model } = req.body;

//     const whereConditions = {
//       name: { [Op.ne]: null },
//       barcode: 'Pass'
//     };

//     if (machineType) {
//       whereConditions.machine = { [Op.startsWith]: machineType };
//     }

//     if (month) {
//       whereConditions[Op.and] = [
//         ...(whereConditions[Op.and] || []),
//         sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "createdAt"')), month)
//       ];
//     }

//     if (year) {
//       whereConditions[Op.and] = [
//         ...(whereConditions[Op.and] || []),
//         sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "createdAt"')), year)
//       ];
//     }

//     if (model) {
//       whereConditions.model = model; // ✅ เพิ่ม model filter
//     }

//     const results = await ProductModel.findAll({
//       attributes: [
//         'name', 'afterset', 'barcode', 'createdAt', 'shift', 'machine', 'model'
//       ],
//       where: whereConditions
//     });

//     const dataMap = {};

//     results.forEach(row => {
//       const name = row.name?.trim();
//       const af = row.afterset?.trim();

//       if (!name) return;

//       if (!dataMap[name]) {
//         dataMap[name] = {
//           name,
//           totalChanges: 0,
//           afterSet: 0,
//           details: []
//         };
//       }

//       dataMap[name].totalChanges += 1;

//       if (af === 'AF1') {
//         dataMap[name].afterSet += 1;
//       }

//       dataMap[name].details.push({
//         date: row.createdAt,
//         shift: row.shift,
//         machine: row.machine,
//         model: row.model,
//       });
//     });

//     const formatted = Object.values(dataMap).map(item => {
//       const percentAF = Math.round((item.afterSet / item.totalChanges) * 100);
//       return {
//         name: item.name,
//         totalChanges: item.totalChanges,
//         afterSet: item.afterSet,
//         normalChange: item.totalChanges - item.afterSet === 0 ? 0.00001 : item.totalChanges - item.afterSet,
//         percentAF,
//         details: item.details,
//         totalHeight: item.totalChanges + item.afterSet, // ✅ รวมยอดแท่งม่วง + แดง
//       };
//     });

//     res.json({ data: formatted });
//   } catch (err) {
//     // console.error("❌ Error in getSetterChangeStacked:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// ---- End Old ok ------------------------

app.post('/getSetterChangeStacked', async (req, res) => {
  try {
    const { machineType, month, year, model } = req.body;

    const whereConditions = {
      name: { [Op.ne]: null },
      barcode: 'Pass'
    };

    if (machineType) {
      whereConditions.machine = { [Op.startsWith]: machineType };
    }

    if (month) {
      whereConditions[Op.and] = [
        ...(whereConditions[Op.and] || []),
        sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "createdAt"')), month)
      ];
    }

    if (year) {
      whereConditions[Op.and] = [
        ...(whereConditions[Op.and] || []),
        sequelize.where(sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "createdAt"')), year)
      ];
    }

    if (model) {
      whereConditions.model = model; // ✅ เพิ่ม model filter
    }

    const results = await ProductModel.findAll({
      attributes: [
        'name', 'barcode', 'createdAt', 'shift', 'machine', 'model',
        'afterset', 'afterset2', 'afterset3', 'afterset4', 'afterset5',
        'nameafterset', 'nameafterset2', 'nameafterset3', 'nameafterset4', 'nameafterset5'
      ],
      where: whereConditions
    });

    const dataMap = {};

    results.forEach(row => {
      const name = row.name?.trim();
      const af = row.afterset?.trim();

      if (!name) return;

      if (!dataMap[name]) {
        dataMap[name] = {
          name,
          totalChanges: 0,
          afterSet: 0,
          details: []
        };
      }

      dataMap[name].totalChanges += 1;

      if (af === 'AF1') {
        dataMap[name].afterSet += 1;
      }

      dataMap[name].details.push({
        date: row.createdAt,
        shift: row.shift,
        machine: row.machine,
        model: row.model,
        afterset: row.afterset,
        afterset2: row.afterset2,
        afterset3: row.afterset3,
        afterset4: row.afterset4,
        afterset5: row.afterset5,
        nameafterset: row.nameafterset,
        nameafterset2: row.nameafterset2,
        nameafterset3: row.nameafterset3,
        nameafterset4: row.nameafterset4,
        nameafterset5: row.nameafterset5
      });
    });

    const formatted = Object.values(dataMap).map(item => {
      const percentAF = Math.round((item.afterSet / item.totalChanges) * 100);
      return {
        name: item.name,
        totalChanges: item.totalChanges,
        afterSet: item.afterSet,
        normalChange: item.totalChanges - item.afterSet === 0 ? 0.00001 : item.totalChanges - item.afterSet,
        percentAF,
        details: item.details,
        totalHeight: item.totalChanges + item.afterSet, // ✅ รวมยอดแท่งม่วง + แดง
      };
    });

    res.json({ data: formatted });
  } catch (err) {
    // console.error("❌ Error in getSetterChangeStacked:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// เพิ่ม API นี้
app.get('/getUniqueModels', async (req, res) => {
  try {
    const models = await ProductModel.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']
      ],
      where: {
        model: { [Op.ne]: null },
        barcode: 'Pass'
      },
      order: [[Sequelize.col('model'), 'ASC']]
    });

    const modelList = models.map(m => m.model);
    res.json({ data: modelList });
  } catch (error) {
    console.error("❌ Error fetching model list:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});




// ✅ BACKEND: สร้าง API สรุปข้อมูล Afterset ตาม name + week
app.post('/getAftersetSummaryByNameWeek', async (req, res) => {
  try {
    const { name, week } = req.body;
    if (!name || !week) {
      return res.status(400).json({ error: 'name และ week เป็นค่าบังคับ' });
    }

    const startOfWeek = moment(week).startOf('isoWeek').toDate();
    const endOfWeek = moment(week).endOf('isoWeek').toDate();

    const results = await ProductModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfWeek, endOfWeek]
        },
        [Op.or]: [
          { nameafterset: name },
          { nameafterset2: name },
          { nameafterset3: name },
          { nameafterset4: name },
          { nameafterset5: name },
        ]
      }
    });

    const summary = {
      AF1: 0,
      AF2: 0,
      AF3: 0,
      AF4: 0,
      AF5: 0
    };

    results.forEach(row => {
      if (row.nameafterset === name && row.afterset === 'AF1') summary.AF1++;
      if (row.nameafterset2 === name && row.afterset2 === 'AF2') summary.AF2++;
      if (row.nameafterset3 === name && row.afterset3 === 'AF3') summary.AF3++;
      if (row.nameafterset4 === name && row.afterset4 === 'AF4') summary.AF4++;
      if (row.nameafterset5 === name && row.afterset5 === 'AF5') summary.AF5++;
    });

    const formatted = Object.entries(summary).map(([af, count]) => ({ af, count }));
    res.json({ data: formatted });
  } catch (err) {
    // console.error('❌ Error in /getAftersetSummaryByNameWeek:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/getStatusMonthly', async (req, res) => {
  const { year, machine } = req.body;
  try {
    let condition = `EXTRACT(YEAR FROM "createdAt") = :year`;
    let replacements = { year };

    if (machine) {
      condition += ` AND "machine" LIKE :machine`;
      replacements.machine = `${machine}%`;
    }

    const result = await sequelize.query(`
        SELECT 
          EXTRACT(MONTH FROM "createdAt") AS month,
          COUNT(*) AS total,
          SUM(CASE WHEN barcode = 'Pass' THEN 1 ELSE 0 END) AS pass,
          SUM(
            CASE 
              -- WHEN "afterset" = 'AF1' THEN 1 
              WHEN "afterset" IN ('AF1', 'AF2', 'AF3', 'AF4', 'AF5') THEN 1 
              ELSE 0 
            END
          ) AS af
        FROM "products"
        WHERE ${condition}
        GROUP BY EXTRACT(MONTH FROM "createdAt")
        ORDER BY EXTRACT(MONTH FROM "createdAt");
      `, {
      replacements,
      type: QueryTypes.SELECT
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const rawMap = {};
    result.forEach(row => {
      rawMap[monthNames[row.month - 1]] = row;
    });

    const mapped = monthNames.map(month => {
      const row = rawMap[month] || {};
      return {
        month,
        total: row.total || 0,
        pass: row.pass || 0,
        af: row.af || 0,
        percent_af: row.total ? (row.af / row.total) * 100 : 0,
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error("❌ Error in getStatusMonthly:", err); // ✅ log ชัดเจน
    res.status(500).json({ error: 'Failed to fetch status data' });
  }
});




module.exports = app;