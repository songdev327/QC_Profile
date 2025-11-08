const express = require("express");
const app = express();
const ProcessModel = require("../models/ProcessModel");

app.post("/process/processRegister", async (req, res) => {
  try {
    const { process } = req.body;
    let result = await ProcessModel.create({
      process: process,
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.send({ message: e.message });
  }
});

app.get("/getProcess", async (req, res) => {
  let result = await ProcessModel.findAll(
    {
      order: ["process"],
    }
  );

  return res.json({ result });
});
app.get("/getProcess/AddprocessAddMachine", async (req, res) => {
  let result = await ProcessModel.findAll(
    {
      order: ["process"],
    }
  );

  return res.json({ result });
});


app.get("/process/list", async (req, res) => {
  try {
    const results = await ProcessModel.findAll({
      order: [["id", "ASC"]],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});


app.delete("/process/delete/:id",  async (req, res) => {
  try {
    await ProcessModel.destroy({
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

app.put("/process/update/:id", async (req, res) => {
  try {
    const { process } = req.body;
    
    const result = await ProcessModel.update(
      {
        process: process,
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
