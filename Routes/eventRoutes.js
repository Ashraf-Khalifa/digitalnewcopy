const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");
const multer = require("multer");

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes for event-related actions
router.post("/add", upload.single("image"), EventController.addEvent); // Add an event
router.get("/list", EventController.getEvents); // Retrieve event list

module.exports = router;
