const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AddPdfMachineTNAllModel = conn.define("machine_tn_all", {
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

AddPdfMachineTNAllModel.sync({ alter: true });

module.exports = AddPdfMachineTNAllModel;