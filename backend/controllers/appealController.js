const Appeal = require('../models/appealModel');
const Attendance = require('../models/attendanceModel');
const { v4: uuidv4 } = require('uuid');

// Controller function to get all appeals
const getAllAppeals = async (req, res) => {
  try {
    const appeals = await Appeal.find();
    res.json(appeals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to create a new appeal
const createAppeal = async (req, res) => {
	const { uin, classId, appealReason } = req.body;

	try {
		// Check for existing records in the attendance collection
		const existingAttendance = await Attendance.findOne({ uin, classId });
		if (existingAttendance) {
			return res.status(400).json({ message: 'Attendance record already exists for this UIN and Class ID' });
		}

		// Check for existing records in the appeal collection
		const existingAppeal = await Appeal.findOne({ uin, classId });
		if (existingAppeal) {
			return res.status(400).json({ message: 'Appeal record already exists for this UIN and Class ID' });
		}

		// Create a new appeal
		const appeal = new Appeal({
			_id: uuidv4(),
			uin,
			classId,
			appealReason,
			appealStatus: 'pending', // Default to 'pending' if not provided
		});

		const newAppeal = await appeal.save();
		res.status(201).json(newAppeal);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Controller function to review an appeal
const reviewAppeal = async (req, res) => {
	const { id } = req.params;

	try {
			const appeal = await Appeal.findById(id);
			if (!appeal) {
			return res.status(404).json({ message: 'Appeal not found' });
			}

			appeal.appealStatus = 'approved';
			const updatedAppeal = await appeal.save();

			const attendance = new Attendance({
				_id: uuidv4(), // Set _id to a UUID
				uin: appeal.uin,
				classId: appeal.classId,
				date: new Date(), // Set the date to the current date
				takenBy: 'appeal system', // Assuming the attendance is taken by the system
			});
	
			const newAttendance = await attendance.save();
	
			res.json({ updatedAppeal, newAttendance });
	} catch (err) {
			res.status(500).json({ message: err.message });
	}
};

module.exports = {
  getAllAppeals,
  createAppeal,
  reviewAppeal,
};