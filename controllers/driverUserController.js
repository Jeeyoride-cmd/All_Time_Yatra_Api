const db = require("../config/db_api");
require("dotenv").config();
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const axios = require("axios"); // Use for you can make HTTP requests easily.

const { logError } = require("../utils/logger");

exports.getDriverOrUserData = async (req, res) => {
  const { user_id, driver_document_id } = req.body || {};

  try {
    if (user_id) {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
        user_id,
      ]);

      if (rows.length > 0) {
        return res.json({
          status: true,
          error: 0,
          success: 1,
          msg: "User data loaded successfully",
          user_data: rows,
        });
      } else {
        return res.json({
          status: false,
          error: 1,
          success: 0,
          msg: "No user found",
        });
      }
    } else if (driver_document_id) {
      const [rows] = await db.query(
        "SELECT * FROM drivers WHERE driver_document_id = ?",
        [driver_document_id]
      );

      if (rows.length > 0) {
        return res.json({
          status: true,
          error: 0,
          success: 1,
          msg: "Driver data loaded successfully",
          driver_data: rows,
        });
      } else {
        return res.json({
          status: false,
          error: 1,
          success: 0,
          msg: "No driver found",
        });
      }
    } else {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: "Missing user_id or driver_document_id",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: "Server Error",
    });
  }
};
