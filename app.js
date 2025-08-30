const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const app = express();
//
const countriesRoutes = require("./routes/countries");
const statesRoutes = require("./routes/states");
const districtsRoutes = require("./routes/districts");
const servicesRoutes = require("./routes/services");
const driverRoutes = require("./routes/driver");
const userRoutes = require("./routes/user");
const vehicleRoutes = require("./routes/vehicle");
const websitesettingRoutes = require("./routes/websitesetting");
const bookingRoutes = require("./routes/booking");
const subscriptionRoutes = require("./routes/subscription");
const ratingRoutes = require("./routes/rating");
const notificationRoutes = require("./routes/notification");
const driverUserRoutes = require("./routes/driveruser");

// const adminRoutes = require('./routes/admin');
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//
// const ocrRoutes = require('./routes/ocr');
// const chatbotRoutes = require('./routes/chatbot');
//
const PORT = 5000;
//
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//
// Static files (for accessing uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api", countriesRoutes);
app.use("/api", statesRoutes);
app.use("/api", districtsRoutes);
app.use("/api", servicesRoutes);
app.use("/api", driverRoutes);
app.use("/api", userRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", websitesettingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", ratingRoutes);
app.use("/api", notificationRoutes);
app.use("/api", driverUserRoutes);

// app.use('/api', ocrRoutes);
// app.use('/api', chatbotRoutes);
//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ADMIN React JS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// app.use('/', adminRoutes);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//
// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});
//
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
