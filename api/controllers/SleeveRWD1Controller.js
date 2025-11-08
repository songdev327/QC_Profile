const express = require("express");
const Service = require("./Service");
const app = express();
const SleeveRWD1ImageModel = require("../models/SleeveRWD1Model");

const AddPdfMachineCSAllModel = require("../models/AddPdfMachineCSAllModel");
const AddPdfMachineSBAllModel = require("../models/AddPdfMachineSBAllModel");
const AddPdfMachineTNAllModel = require("../models/AddPdfMachineTNAllModel");
const AddPdfMachineCHAllModel = require("../models/AddPdfMachineCHAllModel");

const AddPdfMachineTBSAllModel = require("../models/AddPdfMachineTBSAllModel");
const AddPdfMachineTBMAllModel = require("../models/AddPdfMachineTBMAllModel");
const AddPdfMachineTTCAllModel = require("../models/AddPdfMachineTTCAllModel");
const AddPdfMachineTCHAllModel = require("../models/AddPdfMachineTCHAllModel");
const AddPdfMachineTBAllModel = require("../models/AddPdfMachineTBAllModel");

const MasterTypeMachineModel = require("../models/MasterTypeMachineModel");
const MasterSpecQcLineModel = require("../models/MasterSpecQcLineModel");
const MasterToolNumberModel = require("../models/MasterToolNumberModel");


const fileUpload = require("express-fileupload");
const fs = require("fs");



module.exports = app;