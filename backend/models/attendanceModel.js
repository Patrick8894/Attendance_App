const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the uuid package

const attendanceSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Set _id to be a string and default to a UUID
  uin: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  takenBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);