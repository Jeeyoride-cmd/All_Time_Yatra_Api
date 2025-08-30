const db = require('../config/db_api');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Use for you can make HTTP requests easily.

const { logError } = require('../utils/logger');

exports.getRating = async (req, res) => {
  try {
    const { driverid } = req.body;

    if (!driverid) {
      return res.status(400).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Missing parameter driverid',
      });
    }

    // Check if driver exists and is active
    const [driverCheck] = await db.query(
      'SELECT id FROM drivers WHERE id = ? AND driver_active_status = 1',
      [driverid]
    );

    if (driverCheck.length === 0) {
      return res.status(404).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid driverid',
      });
    }

    // Fetch driver ratings with driver details
    const [ratings] = await db.query(
      ` SELECT 
        r.*, 
        d.id AS driverid, 
        d.driver_full_name, 
        d.driver_photo 
      FROM driver_rating r
      LEFT JOIN drivers d ON r.driverid = d.id
      WHERE r.driverid = ? `,
      [driverid]
    );

    if (ratings.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: 'Loaded Successfully',
        data: ratings,
      });
    } else {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'No data found',
      });
    }
  } catch (error) {
    console.error('Error in getRating:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Server error',
    });
  }
};

//
