const conn = require("../connect");
const { DataTypes } = require("sequelize");
const MasterToolNumberSBModel = conn.define("master_tool_number_sb", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  Machine_Number: {
    type: DataTypes.STRING(255),
  },
  Partname_Model: {
    type: DataTypes.STRING(255),
  },
  tool_no: {
    type: DataTypes.STRING(255),
  },
  process: {
    type: DataTypes.STRING(255),
  },
  password_input: {
    type: DataTypes.STRING(255),
  },
});

MasterToolNumberSBModel.sync({ alter: true });

module.exports = MasterToolNumberSBModel;