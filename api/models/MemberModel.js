const conn = require('../connect');
const { DataTypes } = require('sequelize');
const MemberModel = conn.define('members', {
    
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    packageId: {
        type: DataTypes.BIGINT,
    },
    name:  { 
        type: DataTypes.STRING(255)
    },
    lastname:  { 
        type: DataTypes.STRING(255)
    },
    process: {
        type: DataTypes.STRING(255)
    },
    employee: {
        type: DataTypes.STRING(255)
    },
    password: {
        type: DataTypes.STRING(255)
    },
    permissions: {
        type: DataTypes.STRING(255)
    },
    typemc: {
        type: DataTypes.STRING(255)
    },
    password_input: {
        type: DataTypes.STRING(255),
    },
})

MemberModel.sync({alter: true});

module.exports = MemberModel;