const express = require('express');
const router = express.Router();
const { addPrescription, getPatientPrescriptions } = require('../controllers/prescriptionController');

router.post('/add', addPrescription);
router.get('/patient/:id', getPatientPrescriptions);

module.exports = router;