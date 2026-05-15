import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookAppointment.css';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Form States
  const [patientData, setPatientData] = useState({ 
    name: localStorage.getItem('userName') || '', 
    phone: '', 
    email: '', 
    aadhar: '' 
  });
  
  const [bookingData, setBookingData] = useState({ date: '', department: '' });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Result state from Backend
  const [appointmentResult, setAppointmentResult] = useState({ appId: '', serialNo: '' });

  // GSAP Step Transition
  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { opacity: 0, x: 50 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [step]);

  // Fetch Doctors when department is selected in Step 2
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor?department=${bookingData.department}`);
      setDoctors(res.data.data);
      setStep(3);
    } catch (err) {
      toast.error("Failed to load doctors for this department.");
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 2) {
      fetchDoctors();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // ==========================================
  // UPDATED FINAL BOOKING LOGIC (Bulletproof)
  // ==========================================
  const handleFinalBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Verify we have all necessary session data
      const pId = localStorage.getItem('userId');
      const pName = localStorage.getItem('userName') || patientData.name;

      if (!selectedDoctor || !selectedDoctor.doctor_id) {
        toast.error("Please select a doctor again");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        patient_id: pId,
        patient_name: pName,
        doctor_id: selectedDoctor.doctor_id, 
        date: bookingData.date,
        time_slot: "09:00 AM" // You can later make this dynamic
      };

      console.log("Attempting to Book:", payload);

      const res = await axios.post('http://localhost:5000/api/appointment/book', payload);
      
      if (res.data.success) {
        // Map the backend response to the ticket state
        setAppointmentResult({ 
          appId: res.data.data.appointment_id, 
          serialNo: res.data.data.serial_number 
        });
        
        setStep(4); // Trigger GSAP transition to Step 4
        toast.success("Appointment Booked Successfully!");
      }
    } catch (err) {
      console.error("Booking Error Details:", err);
      const errorMsg = err.response?.data?.error || "Server Error: Could not book appointment";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        
        {/* Progress Tracker */}
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Details</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Schedule</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Doctor</div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Confirm</div>
        </div>

        <div className="booking-card" ref={formRef}>
          
          {/* STEP 1: Patient Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <h2>Patient Information</h2>
              <p className="subtitle">Confirm or enter the patient's basic details.</p>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={patientData.name} 
                  onChange={(e) => /^[a-zA-Z\s]*$/.test(e.target.value) && setPatientData({...patientData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input 
                    type="tel" 
                    value={patientData.phone} 
                    maxLength="10"
                    onChange={(e) => setPatientData({...patientData, phone: e.target.value.replace(/\D/g, '')})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={patientData.email} 
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Aadhar Number</label>
                <input 
                  type="text" 
                  value={patientData.aadhar} 
                  maxLength="12"
                  onChange={(e) => setPatientData({...patientData, aadhar: e.target.value.replace(/\D/g, '')})} 
                  required 
                />
              </div>
              
              <div className="button-group">
                <button type="submit" className="btn-next">Next Step</button>
              </div>
            </form>
          )}

          {/* STEP 2: Date & Department */}
          {step === 2 && (
            <form onSubmit={handleNextStep}>
              <h2>Select Date & Department</h2>
              <p className="subtitle">When do you want to visit and which specialist?</p>
              
              <div className="form-group">
                <label>Appointment Date</label>
                <input 
                  type="date" 
                  min={new Date().toLocaleDateString('en-CA')}
                  value={bookingData.date} 
                  onChange={(e)=>setBookingData({...bookingData, date: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select value={bookingData.department} onChange={(e)=>setBookingData({...bookingData, department: e.target.value})} required>
                  <option value="">Select Department...</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
              
              <div className="button-group">
                <button type="button" className="btn-prev" onClick={handlePrevStep}>Back</button>
                <button type="submit" className="btn-next">Find Doctors</button>
              </div>
            </form>
          )}

          {/* STEP 3: Select Doctor (Real Data) */}
          {step === 3 && (
            <div>
              <h2>Available Specialists</h2>
              <p className="subtitle">Showing doctors for {bookingData.department}</p>
              
              <div className="doctor-selection-list">
                {doctors.length > 0 ? (
                  doctors.map(doc => (
                    <div 
                      key={doc.doctor_id} 
                      className={`doctor-select-card ${selectedDoctor?.doctor_id === doc.doctor_id ? 'selected' : ''}`}
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      <div className="doc-info">
                        <h4>Dr. {doc.name}</h4>
                        <p>{doc.experience} Years Experience | {doc.region_city}</p>
                        <small>{doc.comfortable_language}</small>
                      </div>
                      <div className="doc-fee">₹500</div>
                    </div>
                  ))
                ) : (
                  <div className="no-docs-message">No doctors found in this department.</div>
                )}
              </div>
              
              <div className="button-group">
                <button type="button" className="btn-prev" onClick={handlePrevStep}>Back</button>
                <button 
                  type="button" 
                  className="btn-book" 
                  disabled={!selectedDoctor || isSubmitting}
                  onClick={handleFinalBooking}
                >
                  {isSubmitting ? "Processing..." : "Confirm & Book"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Real Confirmation Ticket */}
          {step === 4 && (
            <div className="success-screen">
              <div className="success-icon">✅</div>
              <h2>Booking Confirmed!</h2>
              <p>Your appointment is scheduled with Dr. {selectedDoctor?.name}</p>
              
              <div className="ticket">
                <div className="ticket-row"><span>Patient:</span> <strong>{patientData.name}</strong></div>
                <div className="ticket-row"><span>Dept:</span> <strong>{bookingData.department}</strong></div>
                <div className="ticket-row"><span>Date:</span> <strong>{bookingData.date}</strong></div>
                <div className="ticket-divider"></div>
                <div className="ticket-row highlight"><span>Appointment ID:</span> <strong>{appointmentResult.appId}</strong></div>
                <div className="ticket-row highlight"><span>Queue No:</span> <strong className="serial-num" style={{color: '#e11d48', fontSize: '1.5rem'}}>{appointmentResult.serialNo}</strong></div>
              </div>
              
              <button className="btn-home" style={{width: '100%', backgroundColor: '#059669', color: 'white'}} onClick={() => navigate('/patient/dashboard')}>Go to My Dashboard</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookAppointment;