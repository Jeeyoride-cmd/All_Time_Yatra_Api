// utils/logger.js
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const logFilePath = path.join(__dirname, '../logs/error.log');

function logError(message) {
  const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  const logMessage = `[${timestamp}] ${message}\n`;

  // Create logs folder if it doesn't exist
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('Failed to write to error.log:', err);
  });
}

module.exports = { logError };
