const db = require('../config/db_api');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Use for you can make HTTP requests easily.

const { logError } = require('../utils/logger');

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM site_setting WHERE deleted = 0'
    );

    if (rows.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: 'Successfully loaded data',
        driver_data: rows[0], // assuming single record
      });
    } else {
      return res.status(404).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Data not found',
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Internal Server Error',
    });
  }
};
