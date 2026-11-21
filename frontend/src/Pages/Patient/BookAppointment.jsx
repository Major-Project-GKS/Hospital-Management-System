// src/Pages/Public/BookAppointment.jsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookAppointment.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const stepRef = useRef(null);

  // Check Registered Patient Authentication
  const patientId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const isPatientLoggedIn = Boolean(
    patientId &&
    patientId !== 'PT-GUEST' &&
    (!userRole || userRole.toLowerCase() === 'patient')
  );

  // Form States
  const [patientData, setPatientData] = useState({
    name: localStorage.getItem('userName') || '',
    phone: localStorage.getItem('userPhone') || '',
    email: localStorage.getItem('userEmail') || '',
    aadhar: ''
  });

  const [bookingData, setBookingData] = useState({ date: '', department: '' });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  // Result state from Backend
  const [appointmentResult, setAppointmentResult] = useState({
    appId: '',
    serialNo: '',
    paymentMethod: '',
    paymentStatus: ''
  });

  // GSAP Step Transition Trigger Engine
  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, x: 15 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [step]);

  // Fetch Doctors when department is selected in Step 2
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctor?department=${bookingData.department}`);
      setDoctors(res.data.data);
      setStep(3);
    } catch (err) {
      toast.error('Failed to load doctors for this department.');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!patientData.name || !patientData.phone || !patientData.email || !patientData.aadhar) {
        toast.warning('Please complete all fields to proceed.');
        return;
      }
      if (patientData.phone.length !== 10) {
        toast.warning('Please enter a valid 10-digit phone number.');
        return;
      }
      if (patientData.aadhar.length !== 12) {
        toast.warning('Please enter a valid 12-digit identification number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      fetchDoctors();
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Final booking transmission script aligned with server endpoints
  const handleFinalBooking = async () => {
    if (isSubmitting) return;

    if (!isPatientLoggedIn) {
      toast.error('Please login or register as a patient first.');
      navigate('/login');
      return;
    }

    if (!selectedDoctor || !selectedDoctor.doctor_id) {
      toast.error('Please select a doctor to confirm.');
      return;
    }

    // Validate Payment Details
    if (paymentMethod === 'UPI' && !upiId.trim()) {
      toast.warning('Please enter your UPI ID to proceed.');
      return;
    }

    if (paymentMethod === 'Card') {
      if (cardDetails.number.length < 16 || !cardDetails.expiry || cardDetails.cvv.length < 3) {
        toast.warning('Please complete valid 16-digit card number, expiry, and CVV.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const pName = localStorage.getItem('userName') || patientData.name;

      const payload = {
        patient_id: patientId,
        patient_name: pName,
        doctor_id: selectedDoctor.doctor_id,
        doctor_name: selectedDoctor.name,
        date: bookingData.date,
        time_slot: '09:00 AM',
        consultation_fee: 500,
        payment_method: paymentMethod
      };

      const res = await axios.post(`${API_BASE_URL}/api/appointment/book`, payload);

      if (res.data.success) {
        setAppointmentResult({
          appId: res.data.data.appointment_id,
          serialNo: res.data.data.serial_number,
          paymentMethod: res.data.data.payment_method || paymentMethod,
          paymentStatus:
            res.data.data.payment_status || (paymentMethod === 'Cash' ? 'Pending' : 'Paid')
        });
        setStep(4);
        toast.success('Appointment Booked Successfully!');
      }
    } catch (err) {
      console.error('Booking Transmission Crash:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Server Error: Could not book appointment';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // MANDATORY PATIENT LOGIN / REGISTER GATE
  if (!isPatientLoggedIn) {
    return (
      <div className="booking-single-frame-wrapper">
        <div className="auth-required-card">
          <div className="lock-icon">🔒</div>
          <h2>Patient Login Required</h2>
          <p>
            Registration and login are compulsory before booking an appointment. Please sign in to
            your patient account or register to generate your appointment token.
          </p>
          <div className="auth-gate-btns">
  <button
    type="button"
    className="btn-action-primary"
    onClick={() => navigate('/login', { state: { isRegister: false } })}
  >
    Login to Patient Account
  </button>
  <button
    type="button"
    className="btn-register-outline"
    onClick={() => navigate('/login', { state: { isRegister: true } })}
  >
    Register New Patient
  </button>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-single-frame-wrapper">
      <div className="booking-workspace-split">
        {/* LEFT WORKSPACE COLUMN: INTERACTIVE ACTIVE FORM STEPS */}
        <div className="booking-interactive-card" ref={stepRef}>
          {/* Form Step Status Header */}
          <div className="mini-step-indicator-bar">
            {['Patient Info', 'Schedule Details', 'Doctor & Payment', 'Confirmation'].map(
              (label, index) => (
                <div
                  key={label}
                  className={`mini-step ${step === index + 1 ? 'active' : ''} ${
                    step > index + 1 ? 'done' : ''
                  }`}
                >
                  <span className="dot-index">{index + 1}</span>
                  <span className="dot-label">{label}</span>
                </div>
              )
            )}
          </div>

          <div className="step-content-node">
            {/* STEP 1: Patient Information */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="compact-node-form">
                <div className="node-title-block">
                  <h2>Patient Information</h2>
                  <p>Confirm or enter the patient's basic details.</p>
                </div>

                <div className="form-grid-row">
                  <div className="form-group-node">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={patientData.name}
                      onChange={(e) =>
                        /^[a-zA-Z\s]*$/.test(e.target.value) &&
                        setPatientData({ ...patientData, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="form-group-node">
                    <label>Phone Number</label>
                    <div className="phone-input-wrapper-node">
                      <span className="country-code-node">+91</span>
                      <input
                        type="tel"
                        value={patientData.phone}
                        maxLength="10"
                        placeholder="10-digit number"
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            phone: e.target.value.replace(/\D/g, '')
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-row">
                  <div className="form-group-node">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={patientData.email}
                      placeholder="name@example.com"
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-node">
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      value={patientData.aadhar}
                      maxLength="12"
                      placeholder="12-digit identification number"
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          aadhar: e.target.value.replace(/\D/g, '')
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="action-footer-group">
                  <div />
                  <button type="submit" className="btn-action-primary">
                    Next Step &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Date & Department Selection */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="compact-node-form">
                <div className="node-title-block">
                  <h2>Select Date & Care Track</h2>
                  <p>Choose your preferred date and clinical department.</p>
                </div>

                <div className="form-grid-row">
                  <div className="form-group-node">
                    <label>Appointment Date</label>
                    <input
                      type="date"
                      min={new Date().toLocaleDateString('en-CA')}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-node">
                    <label>Clinical Department</label>
                    <select
                      value={bookingData.department}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, department: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Department...</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                </div>

                <div className="action-footer-group">
                  <button type="button" className="btn-action-back" onClick={handlePrevStep}>
                    &larr; Back
                  </button>
                  <button type="submit" className="btn-action-primary">
                    Find Available Doctors
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Specialist Assignment & Payment Method Panel */}
            {step === 3 && (
              <div className="compact-node-form">
                <div className="node-title-block">
                  <h2>Select Specialist & Payment Method</h2>
                  <p>
                    Choose an active practitioner in {bookingData.department} and select how you
                    wish to pay.
                  </p>
                </div>

                <div className="doctor-scroll-frame">
                  {doctors.length > 0 ? (
                    doctors.map((doc) => (
                      <div
                        key={doc.doctor_id}
                        className={`doctor-selection-row-card ${
                          selectedDoctor?.doctor_id === doc.doctor_id ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedDoctor(doc)}
                      >
                        <div className="doc-meta-left">
                          <h4>Dr. {doc.name}</h4>
                          <p>
                            {doc.experience} Yrs Exp • {doc.region_city || 'Odisha'}
                          </p>
                          <small>{doc.comfortable_language || 'Odia, English'}</small>
                        </div>
                        <div className="doc-meta-right">
                          <span className="fee-token">₹500</span>
                          <span className="select-indicator-dot"></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-doctors-callout">
                      ⚠️ No doctors found registered in this care track.
                    </div>
                  )}
                </div>

                {/* PAYMENT METHOD SELECTION BOX */}
                <div className="payment-selection-box">
                  <div className="payment-header">
                    <h4>Select Payment Method</h4>
                    <span className="fee-tag">Fee: ₹500</span>
                  </div>

                  <div className="payment-options-grid">
                    {[
                      { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: '📱' },
                      { id: 'Card', label: 'Debit / Credit Card', icon: '💳' },
                      { id: 'Cash', label: 'Cash at Counter', icon: '💵' }
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`payment-option-card ${
                          paymentMethod === method.id ? 'selected' : ''
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <span className="pay-icon">{method.icon}</span>
                        <span className="pay-label">{method.label}</span>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="payment-sub-fields">
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. name@okicici or 9876543210@ybl)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="payment-sub-fields card-grid">
                      <input
                        type="text"
                        placeholder="16-Digit Card Number"
                        maxLength="16"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value.replace(/\D/g, '')
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, expiry: e.target.value })
                        }
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="3"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value.replace(/\D/g, '')
                          })
                        }
                      />
                    </div>
                  )}

                  {paymentMethod === 'Cash' && (
                    <p className="cash-note">
                      ℹ️ Pay ₹500 in cash at the hospital reception counter 15 minutes before your
                      scheduled slot.
                    </p>
                  )}
                </div>

                <div className="action-footer-group">
                  <button type="button" className="btn-action-back" onClick={handlePrevStep}>
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    className="btn-action-primary"
                    disabled={!selectedDoctor || isSubmitting}
                    onClick={handleFinalBooking}
                  >
                    {isSubmitting
                      ? 'Processing Allocation...'
                      : paymentMethod === 'Cash'
                      ? 'Confirm Booking (Pay Cash) ⚡'
                      : `Pay ₹500 & Confirm Booking ⚡`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success Ticket Presentation */}
            {step === 4 && (
              <div className="success-screen-node">
                <div className="success-badge-vibe">🎉</div>
                <h3>Booking Confirmed Successfully!</h3>
                <p>Your appointment routing path has been committed to the registry matrix.</p>

                <div className="mini-success-ticket-receipt">
                  <div className="receipt-row">
                    <span>Assigned Specialist:</span>
                    <strong>Dr. {selectedDoctor?.name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Appointment ID:</span>
                    <mark>{appointmentResult.appId}</mark>
                  </div>
                  <div className="receipt-row">
                    <span>Consultation Fee:</span>
                    <strong>₹500.00</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Method:</span>
                    <strong>{appointmentResult.paymentMethod}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Status:</span>
                    <span
                      className={`pay-status-pill ${appointmentResult.paymentStatus.toLowerCase()}`}
                    >
                      {appointmentResult.paymentStatus === 'Paid'
                        ? '✔ Paid Online'
                        : '⏳ Pay Cash at Counter'}
                    </span>
                  </div>
                  <div className="receipt-row big-serial">
                    <span>Queue token sequence:</span>
                    <strong className="queue-glow-num">#{appointmentResult.serialNo}</strong>
                  </div>
                </div>

                <button
                  className="btn-action-primary block-btn"
                  onClick={() => navigate('/patient/dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PERSISTENT SUMMARY VISUAL OVERVIEW */}
        <div className="booking-summary-sidebar-card">
          <h3>Live Booking Summary</h3>
          <div className="summary-vertical-flow">
            <div className="summary-node-item">
              <span className="summary-node-icon">🆔</span>
              <div className="summary-node-text">
                <label>Registered Patient ID</label>
                <p>{patientId}</p>
              </div>
            </div>

            <div className="summary-node-item">
              <span className="summary-node-icon">👤</span>
              <div className="summary-node-text">
                <label>Patient Name</label>
                <p>{patientData.name || <span className="placeholder-text">Awaiting Input...</span>}</p>
              </div>
            </div>

            <div className="summary-node-item">
              <span className="summary-node-icon">📞</span>
              <div className="summary-node-text">
                <label>Contact Number</label>
                <p>
                  {patientData.phone ? (
                    `+91 ${patientData.phone}`
                  ) : (
                    <span className="placeholder-text">Awaiting Input...</span>
                  )}
                </p>
              </div>
            </div>

            <div className="summary-node-item">
              <span className="summary-node-icon">📅</span>
              <div className="summary-node-text">
                <label>Target Date</label>
                <p>{bookingData.date || <span className="placeholder-text">Not Selected</span>}</p>
              </div>
            </div>

            <div className="summary-node-item">
              <span className="summary-node-icon">🏥</span>
              <div className="summary-node-text">
                <label>Department Care Line</label>
                <p>
                  {bookingData.department || <span className="placeholder-text">Not Selected</span>}
                </p>
              </div>
            </div>

            <div className="summary-node-item highlighted-doc-node">
              <span className="summary-node-icon">👨‍⚕️</span>
              <div className="summary-node-text">
                <label>Assigned Medical Practitioner</label>
                <p className="bold-doc-name">
                  {selectedDoctor ? (
                    `Dr. ${selectedDoctor.name}`
                  ) : (
                    <span className="placeholder-text">Select in Step 3</span>
                  )}
                </p>
              </div>
            </div>

            <div className="summary-node-item">
              <span className="summary-node-icon">💳</span>
              <div className="summary-node-text">
                <label>Payment Mode</label>
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="sidebar-cost-total-panel">
            <span>Consultation Retainer:</span>
            <strong>₹500.00</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;