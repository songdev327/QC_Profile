const conn = require('../connect');
const { DataTypes } = require('sequelize');
const ProductModel = conn.define("product", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
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
  process: {
    type: DataTypes.STRING,
  },
  afterset: {
    type: DataTypes.STRING,
  },
  contour: {
    type: DataTypes.STRING,
  },
  sulfcom: {
    type: DataTypes.STRING,
  },
  roncom: {
    type: DataTypes.STRING,
  },
  talysurf: {
    type: DataTypes.STRING,
  },
  t1: {
    type: DataTypes.STRING,
  },
  t2: {
    type: DataTypes.STRING,
  },
  t3: {
    type: DataTypes.STRING,
  },
  t4: {
    type: DataTypes.STRING,
  },
  t5: {
    type: DataTypes.STRING,
  },
  t6: {
    type: DataTypes.STRING,
  },
  t7: {
    type: DataTypes.STRING,
  },
  t8: {
    type: DataTypes.STRING,
  },
  t9: {
    type: DataTypes.STRING,
  },
  t10: {
    type: DataTypes.STRING,
  },
  t11: {
    type: DataTypes.STRING,
  },
  t12: {
    type: DataTypes.STRING,
  },
  t13: {
    type: DataTypes.STRING,
  },
  t14: {
    type: DataTypes.STRING,
  },
  t15: {
    type: DataTypes.STRING,
  },
  t16: {
    type: DataTypes.STRING,
  },
  t17: {
    type: DataTypes.STRING,
  },
  t18: {
    type: DataTypes.STRING,
  },
  t19: {
    type: DataTypes.STRING,
  },
  t20: {
    type: DataTypes.STRING,
  },
  t21: {
    type: DataTypes.STRING,
  },
  t22: {
    type: DataTypes.STRING,
  },
  t23: {
    type: DataTypes.STRING,
  },
  t24: {
    type: DataTypes.STRING,
  },
  t25: {
    type: DataTypes.STRING,
  },
  t26: {
    type: DataTypes.STRING,
  },
  t27: {
    type: DataTypes.STRING,
  },
  t28: {
    type: DataTypes.STRING,
  },
  t29: {
    type: DataTypes.STRING,
  },
  t30: {
    type: DataTypes.STRING,
  },
  t31: {
    type: DataTypes.STRING,
  },
  t32: {
    type: DataTypes.STRING,
  },
  t33: {
    type: DataTypes.STRING,
  },
  t34: {
    type: DataTypes.STRING,
  },
  t35: {
    type: DataTypes.STRING,
  },
  t36: {
    type: DataTypes.STRING,
  },
  t37: {
    type: DataTypes.STRING,
  },
  t38: {
    type: DataTypes.STRING,
  },
  t39: {
    type: DataTypes.STRING,
  },
  t40: {
    type: DataTypes.STRING,
  },
  t41: {
    type: DataTypes.STRING,
  },
  t42: {
    type: DataTypes.STRING,
  },
  t43: {
    type: DataTypes.STRING,
  },
  nameafterset: {
    type: DataTypes.STRING,
  },
  dateafterset: {
    type: DataTypes.DATE,
  },
  timeafterset: {
    type: DataTypes.TIME,
  },
  oil: {
    type: DataTypes.STRING(100),
  },
  air: {
    type: DataTypes.STRING(100),
  },
  pusher: {
    type: DataTypes.STRING(100),
  },
  stopper: {
    type: DataTypes.STRING(100),
  },
  part_set_up: {
    type: DataTypes.STRING(100),
  },
  name_qc_by_off: {
    type: DataTypes.STRING,
  },
  date_qc_by_off: {
    type: DataTypes.DATE,
  },
  time_qc_by_off: {
    type: DataTypes.TIME,
  },
  end_time_qc_by_off: {
    type: DataTypes.TIME,
  },
  remark: {
    type: DataTypes.STRING,
  },
  qc_eqm_start_time: {
    type: DataTypes.TIME,
  },
  qc_eqm_afterset_end_time: {
    type: DataTypes.TIME,
  },
  contour_ng_target_spec: {
    type: DataTypes.STRING,
  },
  contour_ng_drawing_spec: {
    type: DataTypes.STRING,
  },
  contour_over_target: {
    type: DataTypes.STRING,
  },
  contour_under_target: {
    type: DataTypes.STRING,
  },
  sulfcom_ng_target_spec: {
    type: DataTypes.STRING,
  },
  sulfcom_ng_drawing_spec: {
    type: DataTypes.STRING,
  },
  sulfcom_over_target: {
    type: DataTypes.STRING,
  },
  sulfcom_under_target: {
    type: DataTypes.STRING,
  },
  roncom_ng_target_spec: {
    type: DataTypes.STRING,
  },
  roncom_ng_drawing_spec: {
    type: DataTypes.STRING,
  },
  roncom_over_target: {
    type: DataTypes.STRING,
  },
  roncom_under_target: {
    type: DataTypes.STRING,
  },
  talysurf_ng_target_spec: {
    type: DataTypes.STRING,
  },
  talysurf_ng_drawing_spec: {
    type: DataTypes.STRING,
  },
  talysurf_over_target: {
    type: DataTypes.STRING,
  },
  talysurf_under_target: {
    type: DataTypes.STRING,
  },
  projector_status: {
    type: DataTypes.STRING,
  },
  projector_ng_spec_1: {
    type: DataTypes.STRING,
  },
  projector_ng_spec_2: {
    type: DataTypes.STRING,
  },
  projector_ng_spec_3: {
    type: DataTypes.STRING,
  },
  projector_ng_spec_4: {
    type: DataTypes.STRING,
  },
  projector_ng_spec_5: {
    type: DataTypes.STRING,
  },
  name_qc_projector_check: {
    type: DataTypes.STRING,
  },
  date_qc_projector_check: {
    type: DataTypes.DATE,
  },
  time_qc_projector_check: {
    type: DataTypes.TIME,
  },
  area_qc_check: {
    type: DataTypes.STRING,
  },
  tool_change_case: {
    type: DataTypes.STRING,
  },
  qcline_status: {
    type: DataTypes.STRING,
  },
  afterset2: {
    type: DataTypes.STRING,
  },
  nameafterset2: {
    type: DataTypes.STRING,
  },
  afterset3: {
    type: DataTypes.STRING,
  },
  nameafterset3: {
    type: DataTypes.STRING,
  },
  afterset4: {
    type: DataTypes.STRING,
  },
  nameafterset4: {
    type: DataTypes.STRING,
  },
  afterset5: {
    type: DataTypes.STRING,
  },
  nameafterset5: {
    type: DataTypes.STRING,
  },
  dateafterset2: {
    type: DataTypes.DATE,
  },
  timeafterset2: {
    type: DataTypes.TIME,
  },
  dateafterset3: {
    type: DataTypes.DATE,
  },
  timeafterset3: {
    type: DataTypes.TIME,
  },
  dateafterset4: {
    type: DataTypes.DATE,
  },
  timeafterset4: {
    type: DataTypes.TIME,
  },
  dateafterset5: {
    type: DataTypes.DATE,
  },
  timeafterset5: {
    type: DataTypes.TIME,
  },
  origin_barcode: {
    type: DataTypes.STRING,
  },

  nameafterset_eqm: {
    type: DataTypes.STRING,
  },
  afterset_eqm: {
    type: DataTypes.STRING,
  },
  dateafterset_eqm: {
    type: DataTypes.DATE,
  },
  timeafterset_eqm: {
    type: DataTypes.TIME,
  },

  nameafterset_eqm2: {
    type: DataTypes.STRING,
  },
  afterset_eqm2: {
    type: DataTypes.STRING,
  },
  dateafterset_eqm2: {
    type: DataTypes.DATE,
  },
  timeafterset_eqm2: {
    type: DataTypes.TIME,
  },

  nameafterset_eqm3: {
    type: DataTypes.STRING,
  },
  afterset_eqm3: {
    type: DataTypes.STRING,
  },
  dateafterset_eqm3: {
    type: DataTypes.DATE,
  },
  timeafterset_eqm3: {
    type: DataTypes.TIME,
  },

  nameafterset_eqm4: {
    type: DataTypes.STRING,
  },
  afterset_eqm4: {
    type: DataTypes.STRING,
  },
  dateafterset_eqm4: {
    type: DataTypes.DATE,
  },
  timeafterset_eqm4: {
    type: DataTypes.TIME,
  },

  nameafterset_eqm5: {
    type: DataTypes.STRING,
  },
  afterset_eqm5: {
    type: DataTypes.STRING,
  },
  dateafterset_eqm5: {
    type: DataTypes.DATE,
  },
  timeafterset_eqm5: {
    type: DataTypes.TIME,
  },

  sensor_check_tap: {
    type: DataTypes.STRING,
  },
  sensor_check_1: {
    type: DataTypes.STRING,
  },
  sensor_check_2: {
    type: DataTypes.STRING,
  },
  qcline_status_detail: {
    type: DataTypes.STRING,
  },
   ip_address: {
    type: DataTypes.INET,
  },
  system_no: {
    type: DataTypes.BIGINT,
  },
  address_type: {
    type: DataTypes.STRING(255),
  },
  address_no: {
    type: DataTypes.STRING(255),
  },

});


ProductModel.sync({alter: true});

module.exports = ProductModel;