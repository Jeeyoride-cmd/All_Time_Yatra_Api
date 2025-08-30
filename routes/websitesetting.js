const express = require("express");
const router = express.Router();
//
const websitesettingController = require("../controllers/websitesettingController");
//
router.get("/get_settings", websitesettingController.getSettings); // POST

module.exports = router;
//
