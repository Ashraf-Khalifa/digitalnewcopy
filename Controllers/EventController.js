const EventModel = require("../Models/EventModel");
const fs = require("fs");

class EventController {
  static addEvent(req, res) {
    console.log("Received request to add an event.");

    // Extract data from the request
    const { title, date, content } = req.body;
    console.log("Received data:", title, date, content);

    const image = req.file;

    // Check if the image is missing
    if (!image) {
      console.error("Image file is required");
      return res.status(400).json({
        data: null,
        success: false,
        errors: { message: "Image file is required" },
      });
    }

    // Define the file path to save the uploaded image
    const imagePath = `uploads/${image.originalname}`;

    // Write the image to the server's file system
    fs.writeFile(imagePath, image.buffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).json({
          data: null,
          success: false,
          errors: { message: "Error adding event" },
        });
      }

      // Insert the event data into the database with the image file path
      EventModel.addEvent(imagePath, title, date, content, (err, result) => {
        if (err) {
          console.error("MySQL Error:", err);
          return res.status(500).json({
            data: null,
            success: false,
            errors: { message: "Error adding event to the database" },
          });
        }

        console.log("Event added successfully");
        const eventData = {
          title,
          date,
          content,
          image_path: imagePath,
        };
        return res.status(200).json({
          data: eventData,
          success: true,
          errors: {},
        });
      });
    });
  }

  static getEvents(req, res) {
    EventModel.getEvents((err, results) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).json({
          data: null,
          success: false,
          errors: { message: "Error retrieving events" },
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          data: [],
          success: true,
          errors: {},
        });
      }

      const eventDetailsArray = [];

      results.forEach((event) => {
        const eventDetails = {
          title: event.title,
          date: event.date,
          content: event.content,
          image_path: event.image_path,
        };

        eventDetailsArray.push(eventDetails);
      });

      return res.status(200).json({
        data: eventDetailsArray,
        success: true,
        errors: {},
      });
    });
  }
}

module.exports = EventController;
