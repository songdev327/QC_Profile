const conn = require("../connect");
const { DataTypes } = require("sequelize");
const ProcessModel = conn.define("process", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  process: {
    type: DataTypes.STRING(255),
  },
});

ProcessModel.sync({alter: true});

module.exports = ProcessModel;