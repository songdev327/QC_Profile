const conn = require("../connect");
const { DataTypes } = require("sequelize");
const SleeveRWD1ImageModel = conn.define("sleeverwd1", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  imageName: {
    type: DataTypes.STRING,
  },
  toolnumber: {
    type: DataTypes.STRING,
  },
});

SleeveRWD1ImageModel.sync({ alter: true });

module.exports = SleeveRWD1ImageModel;