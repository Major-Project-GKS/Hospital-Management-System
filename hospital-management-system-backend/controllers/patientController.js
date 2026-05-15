const Patient = require('../models/patientModel');
const Appointment = require('../models/appointmentModel'); 
const { validationResult } = require('express-validator');

const registerPatient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    try {
        const { name, phone, email, aadhar_number, password } = req.body;

        const photoFilename = req.files && req.files['photo'] ? req.files['photo'][0].filename : null;
        const aadharFilename = req.files && req.files['aadhar_card'] ? req.files['aadhar_card'][0].filename : null;

        const patient = await Patient.create({
            name,
            phone,
            email,
            aadhar_number,
            password,
            photo: photoFilename,
            aadhar_card: aadharFilename
        });

        res.status(201).json({
            success: true,
            data: {
                id: patient._id,
                application_id: patient.application_id,
                name: patient.name
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, error: `This ${field} is already registered.` });
        }
        res.status(500).json({ success: false, error: "Server Error while saving to database" });
    }
};

const getPatientDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findOne({ application_id: id });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Fetch real appointments linked to this patient ID
        const appointments = await Appointment.find({ patient_id: id }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: {
                profile: {
                    name: patient.name,
                    application_id: patient.application_id,
                    phone: patient.phone,
                    email: patient.email,
                    aadhar_number: patient.aadhar_number, 
                    photo: patient.photo,
                    aadhar_card: patient.aadhar_card
                },
                appointments: appointments 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { registerPatient, getPatientDashboard };