const express = require('express');
const router = express.Router();
const multer = require('multer');
const ocrController = require('../controllers/ocrController');

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post(
  '/ocr-upload',
  upload.single('image'),
  ocrController.processImageocr
);

module.exports = router;
