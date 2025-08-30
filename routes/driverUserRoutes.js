const express = require("express");
const router = express.Router();
const driverUserData = require("../controllers/driverUserController");
//

router.post("/driver_user_data", driverUserData.getDriverOrUserData);

//
module.exports = router;
//
