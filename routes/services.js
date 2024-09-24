const express = require("express");
const ServiceController = require("../controllers/service.controller");
const verifyToken = require("../middleware/verify-token");
const router = express.Router();


router
    .post("/", verifyToken(["manager", "owner"]), (req, res) => ServiceController.createService(req, res))
    .get("/", (req, res) => ServiceController.getAllServices(req, res))
    .delete("/:id", verifyToken(["manager", "owner"]), (req, res) => ServiceController.deleteService(req, res))
    .patch("/:id", verifyToken(["manager", "owner"]), (req, res) => ServiceController.updateService(req, res))

module.exports = router;