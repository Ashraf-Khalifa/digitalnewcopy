const dbConnection = require("../config");

class EventModel {
  static addEvent(imagePath, title, date, content, callback) {
    const insertEventQuery = `
      INSERT INTO events (image_path, title, date, content)
      VALUES (?, ?, ?, ?)
    `;

    dbConnection.query(
      insertEventQuery,
      [imagePath, title, date, content],
      callback
    );
  }

  static getEvents(callback) {
    const selectEventsQuery = `
      SELECT title, date, content, image_path
      FROM events
    `;

    dbConnection.query(selectEventsQuery, callback);
  }
}

module.exports = EventModel;
