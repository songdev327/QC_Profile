const conn = require("../connect");
const { DataTypes } = require("sequelize");

const MasterToolNumberSpecTNModel = conn.define("master_tool_number_spec_tn", {
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
    tool_no: {
        type: DataTypes.STRING(255),
    },
    section_check: {
        type: DataTypes.STRING(255),
    },
    spec_tool_no: {
        type: DataTypes.STRING(255),
    },
    pass: {
        type: DataTypes.STRING(255),
    },
    reject: {
        type: DataTypes.STRING(255),
    },
    rev_control: {
        type: DataTypes.STRING(255),
    },
    part_no: {
        type: DataTypes.STRING(255),
      },
    password_input: {
        type: DataTypes.STRING(255),
    },
    spec_center: {
        type: DataTypes.STRING(255),
    },
    date_control: {
        type: DataTypes.STRING(255),
    },
    div_control: {
        type: DataTypes.STRING(255),
    },
    sequence_number_spec: {
        type: DataTypes.BIGINT,
    },
    mesering_type: {
        type: DataTypes.STRING(255),
    },
});


MasterToolNumberSpecTNModel.sync({ alter: true });

module.exports = MasterToolNumberSpecTNModel;