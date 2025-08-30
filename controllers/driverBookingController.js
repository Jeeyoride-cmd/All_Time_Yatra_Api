// controllers/driverBookingController.js
const db = require("../config/db_api"); // Your DB connection

exports.getDriverRideHistory = async (req, res) => {
  const driverid = req.body.driverid || req.query.driverid;

  if (!driverid) {
    return res.json({
      status: false,
      error: 1,
      success: 0,
      msg: "Missing driver ID",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM booking_ride WHERE driver_id = ?",
      [driverid]
    );

    if (rows.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: "Driver Booking Ride History",
        Ride_History: rows,
      });
    } else {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: "Driver Booking Ride History Not Show",
      });
    }
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: "Server error",
    });
  }
};
