const express = require("express");
const router = express.Router();
//
const multer = require("multer");
// const storage = multer.memoryStorage(); // Use memory for sharp
// const upload = multer({ storage });
//
const userController = require("../controllers/userController");

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/user_profiles"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });
router.post("/register", userController.registerUser);
router.post("/user-check-device", userController.userCheckDevice);
router.get("/user-all-data", userController.getAllusers); // GET
router.post("/user-login-send-otp", userController.userLoginSendOtp); // POST
router.post("/user-verify-otp", userController.userVerifyOtp); // POST
//
module.exports = router;
//
