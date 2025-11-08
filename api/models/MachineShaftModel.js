const conn = require("../connect");
const { DataTypes } = require("sequelize");
const MachineShaftModel = conn.define("machine_shaft", {
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
  password_input: {
    type: DataTypes.STRING(255),
  },
});

MachineShaftModel.sync({alter: true});

module.exports = MachineShaftModel;