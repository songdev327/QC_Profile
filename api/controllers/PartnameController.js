const express = require("express");
const app = express();
const PartnameModel = require("../models/PartnameModel");

app.post("/partname/partnameRegister", async (req, res) => {
  try {
    const { Partname_Model, Part_No } = req.body;
    let result = await PartnameModel.create({
      Partname_Model: Partname_Model,
      Part_No: Part_No,
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.send({ message: e.message });
  }
});


app.get("/getPartModel", async (req, res) => {
  let result = await PartnameModel.findAll(
    {
      order: ["Partname_Model"],
    }
  );
  return res.json({ result });
});
app.get("/getPartModel/AutoPartNo", async (req, res) => {
  let result = await PartnameModel.findAll(
    {
      order: ["Partname_Model","Part_No"],
    }
  );
  return res.json({ result });
});

app.get("/partname/list", async (req, res) => {
  try {
    const results = await PartnameModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/partname/delete/:id",  async (req, res) => {
  try {
    await PartnameModel.destroy({
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

app.put("/partname/update/:id", async (req, res) => {
  try {
    const { Partname_Model, Part_No } = req.body;
    
    const result = await PartnameModel.update(
      {
        Partname_Model: Partname_Model,
        Part_No: Part_No,
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

module.exports = app;
