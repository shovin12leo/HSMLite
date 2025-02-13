const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create an appointment
router.post('/create', async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, reason } = req.body;
    
    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      reason
    });

    await appointment.save();

    // Ensure User model is used correctly
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Appointment Confirmation',
      text: `Your appointment with Dr. ${doctor.name} has been scheduled for ${appointmentDate}. 
             Reason: ${reason}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId patientId');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an appointment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 