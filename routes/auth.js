const express = require("express");
const verifyToken = require("../middleware/verify-token");
const AuthController = require("../controllers/auth.controller");
const router = express.Router();

router
      .post("/sign-up", (req, res) => AuthController.signUp(req, res))
      .post("/sign-in",  (req, res) => AuthController.signIn(req, res))
      .get("/profile", verifyToken(["user", "barber", "manager", "owner"]), (req, res) => AuthController.getProfile(req, res))
      .patch("/profile", verifyToken(["user", "barber", "manager", "owner"]),  (req, res) => AuthController.updateProfile(req, res))

module.exports = router;
