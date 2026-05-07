import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BookAppointment.css';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  
  // Form States
  const [patientData, setPatientData] = useState({ name: '', phone: '', email: '', aadhar: '' });
  const [bookingData, setBookingData] = useState({ date: '', department: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Final Result State
  const [appointmentResult, setAppointmentResult] = useState({ appId: '', serialNo: '' });

  // Mock Doctors Data 
  const mockAvailableDoctors = [
    { id: 'DR1001', name: 'Dr. Ramesh Sharma', department: 'Cardiology', availableTime: '09:00 AM - 01:00 PM', fee: '₹500' },
    { id: 'DR1002', name: 'Dr. Anita Desai', department: 'Cardiology', availableTime: '02:00 PM - 06:00 PM', fee: '₹600' },
    { id: 'DR1003', name: 'Dr. John Smith', department: 'Orthopedics', availableTime: '11:00 AM - 04:00 PM', fee: '₹450' },
    { id: 'DR1004', name: 'Dr. Priya Patel', department: 'General Medicine', availableTime: '08:00 AM - 12:00 PM', fee: '₹300' },
  ];

  const filteredDoctors = mockAvailableDoctors.filter(doc => doc.department === bookingData.department);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { opacity: 0, x: 50 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [step]);

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleBookAppointment = () => {
    const generatedAppId = `AP${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedSerial = Math.floor(Math.random() * 10) + 1;
    
    setAppointmentResult({ appId: generatedAppId, serialNo: generatedSerial });
    setStep(4); 
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
              <p className="subtitle">Please enter the patient's basic details.</p>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter patient name"
                  value={patientData.name} 
                  onChange={(e) => {
                    // Allows ONLY alphabets and spaces
                    const val = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(val)) {
                      setPatientData({...patientData, name: val});
                    }
                  }} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number"
                    value={patientData.phone} 
                    onChange={(e) => {
                      // Strips all non-digits, limits to 10 characters
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) {
                        setPatientData({...patientData, phone: val});
                      }
                    }} 
                    minLength="10"
                    maxLength="10"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="example@domain.com"
                  value={patientData.email} 
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Aadhar Number</label>
                <input 
                  type="text" 
                  placeholder="Enter 12-digit Aadhar number"
                  value={patientData.aadhar} 
                  onChange={(e) => {
                    // Strips all non-digits, limits to 12 characters
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 12) {
                      setPatientData({...patientData, aadhar: val});
                    }
                  }} 
                  minLength="12"
                  maxLength="12"
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
              
              <div className="form-group"><label>Appointment Date</label>
                <input type="date" value={bookingData.date} onChange={(e)=>setBookingData({...bookingData, date: e.target.value})} required />
              </div>
              <div className="form-group"><label>Department</label>
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

          {/* STEP 3: Select Doctor */}
          {step === 3 && (
            <div>
              <h2>Available Doctors</h2>
              <p className="subtitle">Showing doctors for {bookingData.department} on {bookingData.date}</p>
              
              <div className="doctor-selection-list">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`doctor-select-card ${selectedDoctor?.id === doc.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      <div className="doc-info">
                        <h4>{doc.name}</h4>
                        <p>{doc.availableTime}</p>
                      </div>
                      <div className="doc-fee">{doc.fee}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-docs-message">No doctors available for this date/department. Please go back and try another date.</div>
                )}
              </div>
              
              <div className="button-group">
                <button type="button" className="btn-prev" onClick={handlePrevStep}>Back</button>
                <button 
                  type="button" 
                  className="btn-book" 
                  disabled={!selectedDoctor}
                  onClick={handleBookAppointment}
                >
                  Confirm & Book
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success / Confirmation */}
          {step === 4 && (
            <div className="success-screen">
              <div className="success-icon">✅</div>
              <h2>Booking Confirmed!</h2>
              <p>Your appointment has been successfully scheduled.</p>
              
              <div className="ticket">
                <div className="ticket-row"><span>Patient Name:</span> <strong>{patientData.name}</strong></div>
                <div className="ticket-row"><span>Doctor:</span> <strong>{selectedDoctor?.name}</strong></div>
                <div className="ticket-row"><span>Date:</span> <strong>{bookingData.date}</strong></div>
                <div className="ticket-divider"></div>
                <div className="ticket-row highlight"><span>Appointment ID:</span> <strong>{appointmentResult.appId}</strong></div>
                <div className="ticket-row highlight"><span>Queue Serial No:</span> <strong className="serial-num">{appointmentResult.serialNo}</strong></div>
              </div>
              
              <button className="btn-home" onClick={() => window.location.href = '/'}>Return to Home</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookAppointment;