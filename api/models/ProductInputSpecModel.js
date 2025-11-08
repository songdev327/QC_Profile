const conn = require("../connect");
const { DataTypes } = require("sequelize");
const ProductInputSpecModel = conn.define("product_input_spec", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  barcode: {
    type: DataTypes.STRING,
  },
  Machine_Number: {
    type: DataTypes.STRING,
  },
  Partname_Model: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  tool_no: {
    type: DataTypes.STRING,
  },
  section_check: {
    type: DataTypes.STRING,
  },
  spec_tool_no: {
    type: DataTypes.STRING,
  },
  spec_tool_no_input: {
    type: DataTypes.STRING(255),
  },
  tool_change_case: {
    type: DataTypes.STRING,
  },
  date_qc_line: {
    type: DataTypes.DATE,
  },
  start_time_qc_line: {
    type: DataTypes.TIME,
  },
  end_time_qc_line: {
    type: DataTypes.TIME,
  },
  name_qc_line: {
    type: DataTypes.STRING,
  },
  pass: {
    type: DataTypes.STRING, 
  },
  reject: {
    type: DataTypes.STRING, 
  },
  rev_control: {
    type: DataTypes.STRING(255),
},
part_no: {
  type: DataTypes.STRING(255),
},
});

ProductInputSpecModel.sync({ alter: true });

module.exports = ProductInputSpecModel;