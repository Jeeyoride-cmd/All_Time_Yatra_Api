const db = require('../config/db_api');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Use for you can make HTTP requests easily.

const { logError } = require('../utils/logger');

exports.getSubcriptions = async (req, res) => {
  const vehicleTypeId = req.query.vehicle_type_id || req.body.vehicle_type_id;
  const driverId = req.query.driverid || req.body.driverid;

  if (!vehicleTypeId) {
    return res.json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Missing vehicle type ID',
    });
  }

  try {
    // Check if vehicle_type_id exists in rides
    const [vehicleRows] = await db.query(
      'SELECT id FROM vehicle WHERE id = ?',
      [vehicleTypeId]
    );
    if (vehicleRows.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid vehicle type ID',
      });
    }

    if (!driverId) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Missing driver ID',
      });
    }

    // Check if driver is active
    const [driverCheck] = await db.query(
      'SELECT id FROM drivers WHERE id = ? AND driver_active_status = 1',
      [driverId]
    );
    if (driverCheck.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid driver ID',
      });
    }

    // Get driver wallet balance
    const [walletResult] = await db.query(
      'SELECT balance FROM drivers WHERE id = ?',
      [driverId]
    );
    const driverWallet = parseFloat(walletResult[0]?.balance || 0);

    // Get subscriptions
    const [subscriptions] = await db.query(
      'SELECT * FROM `driver_subscriptions_plan` WHERE `vehicle_type_id` = 1 ORDER BY `plan_id` ASC',
      [vehicleTypeId]
    );

    if (subscriptions.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'No data found',
      });
    }

    // Add wallet and remaining payment info
    const updatedSubscriptions = subscriptions.map((sub) => {
      const amount = parseFloat(sub.amount);
      const remainingPay = driverWallet >= amount ? 0 : amount - driverWallet;
      return {
        ...sub,
        driver_wallet: driverWallet,
        remaining_pay_amount: remainingPay,
      };
    });

    return res.json({
      status: true,
      error: 0,
      success: 1,
      msg: 'Loaded Successfully',
      data: updatedSubscriptions,
    });
  } catch (error) {
    console.error('getSubcriptions error:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      msg: 'Server error',
      details: error.message,
    });
  }
};

exports.buySubscriptions = async (req, res) => {
  try {
    const { driverid, plan_id, status, payment_id, wallet_amount } = req.body;

    if (!driverid || !plan_id) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'missing required params',
      });
    }

    const [checkDriver] = await db.query(
      'SELECT id FROM drivers WHERE id = ?',
      [driverid]
    );
    if (checkDriver.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid driverid',
      });
    }

    const [checkPlan] = await db.query(
      'SELECT plan_id FROM driver_subscriptions_plan WHERE plan_id = ?',
      [plan_id]
    );
    if (checkPlan.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Invalid plan id',
      });
    }

    const [existingPlan] = await db.query(
      'SELECT * FROM drivers WHERE id = ? AND plan_expire_status = 1',
      [driverid]
    );
    if (existingPlan.length === 0) {
      return res.json({
        status: false,
        error: 1,
        success: 0,
        msg: 'Your plan validity has not expired',
      });
    }

    const [planDetails] = await db.query(
      'SELECT * FROM driver_subscriptions WHERE id = ?',
      [plan_id]
    );
    const plan = planDetails[0];

    // Update driver plan info
    await db.query(
      `UPDATE drivers SET plan_expire_status = 0, plan_date = NOW(), plan_id = ?, days = ?, plan_amount = ? WHERE id = ?`,
      [plan_id, plan.days, plan.amount, driverid]
    );

    // Insert into driver_subscribers
    await db.query(
      `INSERT INTO driver_subscribers (userid, plan_id, amount, status, days, vehicle_type_id, payment_id, dt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        driverid,
        plan_id,
        plan.amount,
        status,
        plan.days,
        plan.vehicle_type_id,
        payment_id,
      ]
    );

    // Update balance and transactions if wallet amount used
    if (wallet_amount) {
      await db.query(`UPDATE drivers SET balance = balance - ? WHERE id = ?`, [
        wallet_amount,
        driverid,
      ]);
      await db.query(
        `INSERT INTO transactions (userid, amount, msg, type, dt) VALUES (?, ?, 'Debit amount for subscription', 'debit', NOW())`,
        [driverid, wallet_amount]
      );
    }

    return res.json({
      status: true,
      error: 0,
      success: 1,
      msg: 'Buy Successfully',
    });
  } catch (error) {
    console.error('Buy subscription error:', error);
    return res.status(500).json({
      status: false,
      error: 1,
      success: 0,
      msg: 'Internal Server Error',
    });
  }
};

//
