const db = require("../config/db_api");
require("dotenv").config();
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const axios = require("axios"); // Use for you can make HTTP requests easily.

const { logError } = require("../utils/logger");

exports.getActiveVehicle = async (req, res) => {
  try {
    const [vehicles] = await db.execute(
      `SELECT * FROM vehicle WHERE vehicle_type_status=1 and vehicle_type_coming_soon=1 order by id asc`
    );

    if (vehicles.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: "Successfully Loaded Data",
        data: vehicles,
      });
    } else {
      return res.status(404).json({
        status: false,
        error: 1,
        success: 0,
        msg: "No vehicle types found",
      });
    }
  } catch (err) {
    console.error("Error fetching vehicle types:", err);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: "Internal Server Error",
    });
  }
};

exports.getvehicle = async (req, res) => {
  try {
    const [rides] = await db.query(
      "SELECT * FROM vehicle WHERE vehicle_type_status = ?",
      [1]
    );

    if (rides.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: "Loaded Successfully",
        ride_data: rides,
      });
    } else {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: "No Data Found",
      });
    }
  } catch (error) {
    console.error("getRides error:", error);
    return res.status(500).json({
      status: false,
      error: 1,
      msg: "Server error",
      details: error.message,
    });
  }
};
