const conn = require("../connect");
const { DataTypes } = require("sequelize");
const MasterTypeMachineModel = conn.define("master_type_machine", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  machine_type: {
    type: DataTypes.STRING(255),
  },
});

MasterTypeMachineModel.sync({alter: true});

module.exports = MasterTypeMachineModel;