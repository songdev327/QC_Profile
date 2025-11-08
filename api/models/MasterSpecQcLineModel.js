const conn = require("../connect");
const { DataTypes } = require("sequelize");
const MasterSpecQcLineModel = conn.define("master_spec_qc_line", {
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
  spec: {
    type: DataTypes.STRING(255),
  },
});

MasterSpecQcLineModel.sync({alter: true});

module.exports = MasterSpecQcLineModel;