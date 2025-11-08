const conn = require('../connect');
const {DataType, DataTypes} = require('sequelize');

const PackageModel = conn.define("packages", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
});

PackageModel.sync({alter: true});

module.exports = PackageModel;