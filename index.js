const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const app = express();
const db = require("./config/db_api");
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
const driverUserRoutes = require("./routes/driverUserRoutes");
const driverBookingRoutes = require("./routes/driverBookingRoutes");
const checkuser = require("./routes/checkuserRoutes");
const driverDashboard = require("./routes/driverDashboard");
const DriverProfile = require("./routes/driverProfile");
const driverEarning = require("./routes/driverEarningRoutes");
const driverAllTrips = require("./routes/Driveralltrips");
const driverWeburl = require("./routes/DriverWeburlRoutes");
const Logout = require("./routes/LogoutRouter");
const UpdateTripStatus = require("./routes/UpdateTripStatus");
const tripSummary = require("./routes/TripSummaryOneway");
const CreateTrip = require("./routes/CreateTrip_Oneway");
const PassengerList = require("./routes/PassengerListOneWay");
const BookStatusPessanger = require("./routes/BookTripStatusPessanger");
const LoginSendOtp = require("./routes/loginSendOtp");
const VerifyOtp = require("./routes/VerifyOtpOneway");
const RegisterStep1 = require("./routes/RegisterStep1");
const RegisterStep2 = require("./routes/RegisterStep2");
const RegisterStep3 = require("./routes/RegisterStep3");
const RegisterStep4 = require("./routes/RegisterStep4");
const CompletedTripHistory = require("./routes/TripsHistory");
const DriverRating = require("./routes/DriverRatingOneWay");
const UpdateProfile = require("./routes/UpdateProfile");

const PORT = 4000;
//
// app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require("express-session");

app.use(
  session({
    secret: "jeeyoride@admin", // use strong key in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // secure: true only when using HTTPS
  })
);

// ✅ Correctly placed CORS config (FIRST middleware)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
//
//
// Static files (for accessing uploaded images)
app.use("/", express.static(path.join(process.cwd(), "uploads")));

app.use("drivers_kyc", express.static(__dirname + "drivers_kyc"));

// Routes
app.use("/api", countriesRoutes);
app.use("/api", statesRoutes);
app.use("/api", districtsRoutes);
app.use("/api", checkuser);
app.use("/api", driverDashboard);
app.use("/api", driverEarning);
app.use("/api", driverAllTrips);

app.use("/api", driverWeburl);
app.use("/api", DriverProfile);
app.use("/api", Logout);
app.use("/api", UpdateTripStatus);
app.use("/api", tripSummary);
app.use("/api", CreateTrip);
app.use("/api", PassengerList);
app.use("/api", BookStatusPessanger);
app.use("/api", LoginSendOtp);
app.use("/api", VerifyOtp);
app.use("/api", servicesRoutes);
app.use("/api", RegisterStep1);
app.use("/api", RegisterStep2);
app.use("/api", RegisterStep3);
app.use("/api", RegisterStep4);
app.use("/api", CompletedTripHistory);
app.use("/api", DriverRating);
app.use("/api", UpdateProfile);
// ========================
app.use("/api", driverRoutes);
app.use("/api", userRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", websitesettingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", ratingRoutes);
app.use("/api", notificationRoutes);
app.use("/api", driverUserRoutes);
app.use("/api", driverBookingRoutes);

module.exports = app;
