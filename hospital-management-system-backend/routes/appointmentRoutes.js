const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Using the object property ensures we don't pass an undefined middleware
router.post('/book', (req, res) => appointmentController.bookAppointment(req, res));
router.put('/status/:id', (req, res) => appointmentController.updateStatus(req, res));

module.exports = router;