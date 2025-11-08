const conn = require("../connect");
const { DataTypes } = require("sequelize");
const MachineModel = conn.define("machine", {
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
  process: {
    type: DataTypes.STRING(255),
  },
   ip_address: {
    type: DataTypes.INET,
  },
  system_no: {
    type: DataTypes.BIGINT,
  },
  address_type: {
    type: DataTypes.STRING(255),
  },
  address_no: {
    type: DataTypes.STRING(255),
  },
  password_input: {
    type: DataTypes.STRING(255),
  },
});

MachineModel.sync({alter: true});

module.exports = MachineModel;
