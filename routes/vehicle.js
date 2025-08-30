const express = require("express");
const router = express.Router();
//
const vehicleController = require("../controllers/vehicleController");
//
router.get("/getVechiletypes", vehicleController.getActiveVehicle);
router.get("/get-vehicle", vehicleController.getvehicle);
//
module.exports = router;
//
