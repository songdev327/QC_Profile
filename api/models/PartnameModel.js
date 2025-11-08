const conn = require("../connect");
const { DataTypes } = require("sequelize");
const PartnameModel = conn.define("partname", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  Partname_Model: {
    type: DataTypes.STRING(255),
  },
  Part_No: {
    type: DataTypes.STRING(255),
  },
});

PartnameModel.sync({ alter: true });

module.exports = PartnameModel;
