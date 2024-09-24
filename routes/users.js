const express = require("express");
const verifyToken = require("../middleware/verify-token");
const UserController = require("../controllers/user.controller.js");
const router = express.Router();

router
    .get("/", verifyToken(["manager", "owner"]), (req, res) => UserController.getAllUsers(req, res))
    .get("/barbers", (req, res) => UserController.getBarbers(req, res))
    .patch("/archive/:id", verifyToken(["manager", "owner"]), (req, res) => UserController.archiveUser(req, res))
    .patch("/unarchive/:id", verifyToken(["manager", "owner"]), (req, res) => UserController.unarchiveUser(req, res))
    .patch("/update-role/:id", verifyToken(["manager", "owner"]), (req, res) => UserController.changeUserRole(req, res))

module.exports = router