const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AddPdfMachineSBAllModel = conn.define("machine_sb_all", {
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

AddPdfMachineSBAllModel.sync({ alter: true });

module.exports = AddPdfMachineSBAllModel;