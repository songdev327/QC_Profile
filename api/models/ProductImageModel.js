const conn = require("../connect");
const { DataTypes } = require("sequelize");
const ProductImageModel = conn.define("productImage", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  imageName: {
    type: DataTypes.STRING,
  },
  isMain: {
    type: DataTypes.BOOLEAN,
  },
  status: {
    type: DataTypes.STRING,
  },
  mesering: {
    type: DataTypes.STRING,
  },
  afterset: {
    type: DataTypes.STRING,
  },
  barcode: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  shift: {
    type: DataTypes.STRING,
  },
  machine: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
  dateeqm: {
    type: DataTypes.DATE,
  },
  timeeqm: {
    type: DataTypes.TIME,
  },
  nameeqm: {
    type: DataTypes.STRING,
  },
  projector_type: {
    type: DataTypes.STRING,
  },
  projector_status: {
    type: DataTypes.STRING,
  },
  nameafterset: {
    type: DataTypes.STRING,
  },
});

ProductImageModel.sync({ alter: true });

module.exports = ProductImageModel;
