const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  specialization: { 
    type: String, 
    required: function() { return this.role === 'doctor'; } 
  },
  // Additional fields for doctors
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 