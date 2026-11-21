const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentModel');

// @desc    Add a new digital prescription
// @route   POST /api/prescription/add
const addPrescription = async (req, res) => {
  try {
    const { 
      appointment_id, 
      patient_id, 
      doctor_id, 
      doctor_name, 
      weight,
      bp,
      lab_tests,
      diagnosis, 
      medicines, 
      advice 
    } = req.body;

    // 1. Create the prescription record with optional vitals & lab tests
    const prescription = await Prescription.create({
      appointment_id,
      patient_id,
      doctor_id,
      doctor_name,
      weight: weight || '',
      bp: bp || '',
      lab_tests: lab_tests || '',
      diagnosis,
      medicines,
      advice: advice || ''
    });

    // 2. Update the Appointment status to 'Completed' automatically
    await Appointment.findOneAndUpdate(
      { appointment_id: appointment_id },
      { status: 'Completed' }
    );

    res.status(201).json({
      success: true,
      message: "Prescription saved and appointment completed",
      data: prescription
    });
  } catch (error) {
    console.error("Prescription Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all prescriptions for a specific patient
// @route   GET /api/prescription/patient/:id
const getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params; // PTXXXX ID

    const prescriptions = await Prescription.find({ patient_id: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addPrescription, getPatientPrescriptions };