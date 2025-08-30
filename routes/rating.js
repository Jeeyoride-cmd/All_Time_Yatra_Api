const express = require('express');
const router = express.Router();
//
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory for sharp
const upload = multer({ storage });
//
const ratingController = require('../controllers/ratingController');
//

router.get('/get-Rating', ratingController.getRating);

//
module.exports = router;
//
