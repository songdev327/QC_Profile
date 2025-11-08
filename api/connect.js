const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("QC_Profile_Common_Monitor", "postgres", "m1nebea", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
  port: 5433,
});

module.exports = sequelize;



// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize("qc_profile_improve", "postgres", "bangpa1n", {
//   host: "localhost",
//   dialect: "postgres",
//   logging: false,
//   port: 5433,
// });

// module.exports = sequelize;