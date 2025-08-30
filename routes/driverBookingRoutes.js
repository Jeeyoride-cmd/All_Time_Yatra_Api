// routes/driverBookingRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDriverRideHistory,
} = require("../controllers/driverBookingController");

router.post("/driver_booking_ride_history", getDriverRideHistory);

module.exports = router;
