const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AddPdfMachineTBSAllModel = conn.define("machine_tbs_all", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  imageName: {
    type: DataTypes.STRING,
  },
  process: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  toolnumber: {
    type: DataTypes.STRING,
  },
  machine_type: {
    type: DataTypes.STRING,
  },

});

AddPdfMachineTBSAllModel.sync({ alter: true });

module.exports = AddPdfMachineTBSAllModel;