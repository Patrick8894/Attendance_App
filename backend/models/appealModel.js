const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const appealSchema = new Schema({
  _id: { type: String, default: uuidv4 }, // Set _id to be a string and default to a UUID
  uin: { 
    type: String, 
    required: true 
},
  classId: { 
    type: String, 
    required: true 
},
  appealReason: { 
    type: String, 
    required: true 
},
  appealStatus: { 
    type: String, 
    required: true,
},
});

module.exports = mongoose.model('Appeal', appealSchema);