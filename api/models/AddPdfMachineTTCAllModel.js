const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AddPdfMachineTTCAllModel = conn.define("machine_ttc_all", {
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

AddPdfMachineTTCAllModel.sync({ alter: true });

module.exports = AddPdfMachineTTCAllModel;