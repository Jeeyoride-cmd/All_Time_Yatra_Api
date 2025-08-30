// rateLimiters.js (Optional helper file)
const rateLimit = require('express-rate-limit');

// Limit login route: 5 requests per 15 mins
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    status: 429,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// Limit booking route: 30 requests per 15 mins
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: 'Too many booking requests. Please slow down.',
  },
});

module.exports = {
  loginLimiter,
  bookingLimiter,
};
