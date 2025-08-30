const express = require('express');
const router = express.Router();
//
const subscriptionController = require('../controllers/subscriptionController');
//
router.get('/get-subcriptions', subscriptionController.getSubcriptions);
router.get('/buy-subscriptions', subscriptionController.buySubscriptions);

//
module.exports = router;
//
