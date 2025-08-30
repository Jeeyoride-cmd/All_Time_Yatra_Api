const Tesseract = require('tesseract.js');
const fs = require('fs');
const db = require('../config/db_api');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const Joi = require('joi');
const path = require('path');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const axios = require('axios'); // Use for you can make HTTP requests easily.
const { format } = require('date-fns');

const { logError } = require('../utils/logger');

// exports.processImageocr = async (req, res) => {
//   if (!req.file)
//     return res
//       .status(400)
//       .json({ success: false, message: 'No image uploaded' });

//   const imagePath = req.file.path;
//   console.log('Image path:', imagePath);

//   try {
//     const result = await Tesseract.recognize(imagePath, 'eng', {
//       logger: (m) => console.log(m),
//     });

//     // Delete the uploaded file after processing
//     fs.unlink(imagePath, () => {});

//     res.json({
//       success: true,
//       text: result.data.text,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'OCR failed',
//       error: error.message,
//     });
//   }
// };

// exports.processImageocr = async (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ success: false, message: 'No image uploaded' });
//   }

//   const imagePath = req.file.path;

//   try {
//     const result = await Tesseract.recognize(imagePath, 'eng', {
//       logger: (m) => console.log(m),
//     });

//     const text = result.data.text;

//     // Remove the uploaded file
//     fs.unlink(imagePath, () => {});

//     // Regex-based field extraction
//     const nameMatch = text.match(
//       /(?:Name[:\-]?\s*)([A-Z][a-z]+(?: [A-Z][a-z]+)+)/
//     );
//     const dobMatch = text.match(
//       /(?:DOB|Date of Birth)[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
//     );
//     const dlMatch = text.match(
//       /(?:DL No|Licence No)[:\-]?\s*([A-Z]{2}\d{10,})/i
//     );
//     const addressMatch = text.match(/Address[:\-]?\s*(.+)/i);

//     res.json({
//       success: true,
//       raw_text: text,
//       name: nameMatch?.[1] || null,
//       dob: dobMatch?.[1] || null,
//       license_number: dlMatch?.[1] || null,
//       address: addressMatch?.[1] || null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'OCR failed',
//       error: error.message,
//     });
//   }
// };

exports.processImageocr = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No image uploaded' });
    }

    const originalPath = req.file.path;
    const processedPath = path.join('public', 'processed_' + req.file.filename);

    // 🧪 Step 1: Enhance the image for better OCR using sharp
    await sharp(originalPath).grayscale().normalize().toFile(processedPath);

    // 🧠 Step 2: Perform OCR on the enhanced image
    const result = await Tesseract.recognize(processedPath, 'eng', {
      logger: (m) => console.log(m), // Optional: for debugging
    });

    const text = result.data.text;
    const cleanedText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    // 🧠 Step 3: Extract Fields Using Regex
    const dlMatch = cleanedText.match(
      /DL\s*No\s*[:\-]?\s*([A-Z]{2}\d{2}\s?\d{11})/i
    );
    const dobMatch = cleanedText.match(
      /DOB\s*[:\-]?\s*(\d{2}[-\/]\d{2}[-\/]\d{4})?/i
    );
    const nameMatch = cleanedText.match(/Name\s*[~:\-]?\s*([A-Z ]{3,})/i);
    const addressMatch = cleanedText.match(
      /Add\s*[:\-]?\s*(.*?)(?:PIN|Signature|Issuing Authority)/i
    );

    console.log('dlMatch:', dlMatch);
    console.log('dobMatch:', dobMatch);
    console.log('nameMatch:', nameMatch);
    console.log('addressMatch:', addressMatch);

    // 🧹 Step 4: Cleanup files
    fs.unlink(originalPath, () => {});
    fs.unlink(processedPath, () => {});

    // ✅ Step 5: Respond with structured result
    return res.json({
      success: true,
      raw_text: text,
      name: nameMatch?.[1]?.trim() || null,
      name: nameMatch?.[1]?.trim() || null,
      dob: dobMatch?.[1]?.trim() || null,
      license_number: dlMatch?.[1]?.replace(/\s+/g, '') || null,
      address: addressMatch?.[1]?.replace(/\s{2,}/g, ' ').trim() || null,
    });
  } catch (error) {
    console.error('OCR ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'OCR failed',
      error: error.message,
    });
  }
};
