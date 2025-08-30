const db = require('../config/db_api');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Use for you can make HTTP requests easily.

const { logError } = require('../utils/logger');

exports.registerUser = async (req, res) => {
  try {
    const {
      user_full_name,
      user_email,
      user_mobile,
      user_country_id,
      user_language,
      user_device_token,
      user_permanent_address,
      user_reffer_to,
      user_latitude,
      user_longitude,
      user_device_id,
    } = req.body;

    const refferal_code = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
    const user_register_at = new Date();

    if (!user_full_name)
      return res.json({
        status: false,
        error: 1,
        msg: 'Missing parameter User Name',
      });
    if (!user_mobile)
      return res.json({
        status: false,
        error: 1,
        msg: 'Missing parameter User Mobile',
      });

    // Check if mobile exists
    const [existingUser] = await db.execute(
      'SELECT user_mobile FROM users WHERE user_mobile = ?',
      [user_mobile]
    );
    if (existingUser.length > 0) {
      return res.json({
        status: false,
        error: 1,
        msg: 'Mobile Number Already exists',
      });
    }

    if (!user_country_id)
      return res.json({
        status: false,
        error: 1,
        msg: 'Missing parameter Country',
      });
    if (!user_language)
      return res.json({
        status: false,
        error: 1,
        msg: 'Missing parameter Language',
      });

    if (user_reffer_to) {
      const [refUser] = await db.execute(
        'SELECT id FROM users WHERE user_reffer_to = ?',
        [user_reffer_to]
      );
      if (refUser.length === 0) {
        return res.json({
          status: false,
          error: 1,
          msg: 'Invalid referral code',
        });
      }
    }

    // Insert user
    const [result] = await db.execute(
      `
      INSERT INTO users 
      (user_full_name, user_device_token, user_email, user_mobile, user_language, user_latitude, user_longitude, user_referal_code, user_device_id, user_register_at, user_country_id, user_permanent_address, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')
    `,
      [
        user_full_name,
        user_device_token,
        user_email,
        user_mobile,
        user_language,
        user_latitude,
        user_longitude,
        refferal_code,
        user_device_id,
        user_register_at,
        user_country_id,
        user_permanent_address,
      ]
    );

    const userid = result.insertId;
    const username = 'JEEYORIDEU' + String(userid).padStart(4, '0');
    await db.execute('UPDATE users SET username = ? WHERE id = ?', [
      username,
      userid,
    ]);

    // // Handle Image Upload
    // if (req.file) {
    //   const finalurl = `userapi/uploads/${req.file.filename}`;
    //   await db.execute('UPDATE users SET image = ? WHERE id = ?', [
    //     finalurl,
    //     userid,
    //   ]);
    // }

    // Referral logic
    if (user_reffer_to) {
      const [[refUser]] = await db.execute(
        'SELECT id FROM users WHERE user_reffer_to = ?',
        [user_reffer_to]
      );
      await db.execute('UPDATE users SET user_reffer_to = ? WHERE id = ?', [
        user_reffer_to,
        userid,
      ]);
      await db.execute(
        'INSERT INTO refferals_list (userid, reffer_to_userid, dt) VALUES (?, ?, NOW())',
        [userid, refUser.id]
      );
      await db.execute(
        'UPDATE users SET user_reffer_count = user_reffer_count + 1 WHERE user_reffer_to = ?',
        [user_reffer_to]
      );
    }

    const [[newUser]] = await db.execute('SELECT * FROM users WHERE id = ?', [
      userid,
    ]);

    res.json({
      status: true,
      error: 0,
      success: 1,
      msg: 'Register Successfully',
      userdata_data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: false, error: 1, msg: 'Something went wrong' });
  }
};

exports.userCheckDevice = async (req, res) => {
  const { userid, device_token } = req.body;

  if (!userid || !device_token) {
    return res.json({
      status: false,
      error: 1,
      success: 0,
      msg: 'missing parameter userid, device_token',
    });
  }

  try {
    const [userResult] = await db.execute('SELECT * FROM users WHERE id = ?', [
      userid,
    ]);
    if (userResult.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid userid',
      });
    }

    const [deviceResult] = await db.execute(
      'SELECT * FROM users WHERE user_device_token = ?',
      [device_token]
    );
    if (deviceResult.length > 0) {
      return res.json({
        status: true,
        error: 0,
        success: 1,
        msg: 'This device_token is login',
      });
    } else {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'This device_token is not login',
      });
    }
  } catch (error) {
    console.error('Error checking device:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Internal server error',
    });
  }
};

exports.getAllusers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.userLoginSendOtp = async (req, res) => {
  const { user_mobile, user_latitude, user_longitude } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);

  const now = new Date();
  const login_time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const login_date = `${String(now.getDate()).padStart(2, '0')}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${now.getFullYear()}`;

  if (!user_mobile) {
    return res.status(400).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Missing Required Parameters',
    });
  }

  try {
    // Step 1: Check if user exists
    const [userRows] = await db.query(
      'SELECT id FROM users WHERE user_mobile = ?',
      [user_mobile]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Sign Up First',
      });
    }

    const userId = userRows[0].id;

    // Step 2: Send OTP via 2Factor API
    const apiKey = process.env.TWO_FACTOR_API_KEY;
    const otpApiUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${user_mobile}/${otp}/OTP_LOGIN`;
    const response = await axios.get(otpApiUrl);

    if (response.data.Status !== 'Success') {
      return res.status(500).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'OTP Sending Failed',
      });
    }

    // Step 3: Insert login history
    await db.query(
      `INSERT INTO user_login_history (user_id, login_time, login_date, user_latitude, user_longitude, user_otp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        login_time,
        login_date,
        user_latitude || null,
        user_longitude || null,
        otp,
      ]
    );

    return res.json({
      status: true,
      error: 0,
      success: 1,
      msg: 'OTP Sent Successfully',
      otp,
    });
  } catch (error) {
    console.error('User OTP Error:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Server Error',
    });
  }
};

exports.userVerifyOtp = async (req, res) => {
  const { user_mobile, otp } = req.body;

  if (!user_mobile || !otp) {
    return res.status(400).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Mobile Number And OTP Required',
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT ulh.user_id, ulh.user_otp FROM user_login_history ulh
       JOIN users u ON ulh.user_id = u.id
       WHERE u.user_mobile = ? AND ulh.status = 0
       ORDER BY ulh.id DESC LIMIT 1`,
      [user_mobile]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'No OTP Found or Already Verified',
      });
    }

    const latestOtp = rows[0].user_otp;
    const user_id = rows[0].user_id;

    if (otp == latestOtp) {
      await db.query(
        `UPDATE user_login_history SET status = 1 WHERE user_id = ? AND status = 0`,
        [user_id]
      );

      return res.status(200).json({
        status: true,
        error: 0,
        success: 1,
        msg: 'Successfully Verified',
      });
    } else {
      return res.status(401).json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error('User verifyOtp Error:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Internal Server Error',
    });
  }
};
