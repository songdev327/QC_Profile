const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AddPdfMachineTCHAllModel = conn.define("machine_tch_all", {
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

AddPdfMachineTCHAllModel.sync({ alter: true });

module.exports = AddPdfMachineTCHAllModel;