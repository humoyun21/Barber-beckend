const express = require("express");
const BookingController = require("../controllers/booking.controller");
const verifyToken = require("../middleware/verify-token");
const router = express.Router();


router
    .post("/", verifyToken(["user"]), (req, res) => BookingController.createOrder(req, res))
    .get("/", verifyToken(["barber", "manager", "owner"]), (req, res) => BookingController.getBookings(req, res))

module.exports = router;