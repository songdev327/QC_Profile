const conn = require("../connect");
const { DataTypes } = require("sequelize");
const PartnameShaftModel = conn.define("partname_shaft", {
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

PartnameShaftModel.sync({ alter: true });

module.exports = PartnameShaftModel;