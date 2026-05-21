import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import EditProfileComp from '../../Components/EditProfileComp';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Controls view state toggling
  
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const UPLOADS_URL = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const patientId = localStorage.getItem('userId');
        if (!patientId) { navigate('/'); return; }

        const response = await axios.get(`http://localhost:5000/api/patient/dashboard/${patientId}`);
        setPatientData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate('/');
      }
    };
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (activeTab === 'History') {
        try {
          const patientId = localStorage.getItem('userId');
          const res = await axios.get(`http://localhost:5000/api/prescription/patient/${patientId}`);
          setPrescriptions(res.data.data);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
        }
      }
    };
    fetchPrescriptions();
  }, [activeTab]);

  useEffect(() => {
    if (!isLoading && contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
  }, [activeTab, isLoading, isEditing]);

  const downloadPDF = (pres) => {
    console.log("Downloading PDF for:", pres.appointment_id);
    alert("PDF Download feature coming soon! You can view the details on screen for now.");
  };

  if (isLoading) return <div className="patient-loading-screen"><h2>Loading records... 🏥</h2></div>;

  return (
    <div className="patient-dashboard">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          {patientData.profile.photo ? (
             <img src={`${UPLOADS_URL}${patientData.profile.photo}`} alt="Profile" className="sidebar-profile-photo" />
          ) : ( <div className="avatar">👤</div> )}
          <h3>{patientData.profile.name}</h3>
          <p>Patient ID: {patientData.profile.application_id}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => { setActiveTab('Overview'); setIsEditing(false); }}>Dashboard Overview</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => { setActiveTab('Profile'); setIsEditing(false); }}>My Profile</li>
          <li className={activeTab === 'History' ? 'active' : ''} onClick={() => { setActiveTab('History'); setIsEditing(false); }}>Medical History</li>
          <li><Link to="/appointment" className="sidebar-link">Book New Appointment</Link></li>
          <li className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content" ref={contentRef}>
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <h2>Welcome back, {patientData.profile.name.split(' ')[0]}! 👋</h2>
            <p className="subtitle">Here is an overview of your health schedule.</p>
            <div className="dashboard-cards">
              <div className="dash-card primary-card">
                <div className="card-header"><h3>Upcoming Appointment</h3></div>
                <div className="card-body">
                  {patientData.appointments && patientData.appointments.length > 0 ? (
                    <div className="appointment-info-box">
                       <p><strong>Status:</strong> <span className="status-badge">{patientData.appointments[0].status}</span></p>
                       <p><strong>Date:</strong> {patientData.appointments[0].date}</p>
                       <p><strong>Time:</strong> {patientData.appointments[0].time_slot}</p>
                    </div>
                  ) : (
                    <div className="empty-state-container">
                      <p>No upcoming appointments.</p>
                      <Link to="/appointment" className="quick-book-link">Book one now &rarr;</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="dash-card action-card">
                <h3>Quick Actions</h3>
                <Link to="/appointment" className="btn-action">📅 Book Appointment</Link>
                <button className="btn-action outline" onClick={() => setActiveTab('History')}>📄 View Prescriptions</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>My Profile Details</h2>
              {!isEditing && (
                <button className="btn-corner-edit" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
              )}
            </div>

            {!isEditing ? (
              <div className="dash-card profile-details-card">
                <div className="profile-details-grid">
                  <div><h4 className="detail-label">Full Name</h4><p className="detail-value">{patientData.profile.name}</p></div>
                  <div><h4 className="detail-label">Email Address</h4><p className="detail-value">{patientData.profile.email}</p></div>
                  <div><h4 className="detail-label">Phone Number</h4><p className="detail-value">+91 {patientData.profile.phone}</p></div>
                  <div><h4 className="detail-label">Identity Document Status</h4><p className="detail-value">Verified Profile (12-Digit Entry Checked)</p></div>
                </div>
                <hr className="section-divider" />
                <div>
                  <h4 className="detail-label docs-label">Identity Documents</h4>
                  {patientData.profile.aadhar_card ? (
                    <a href={`${UPLOADS_URL}${patientData.profile.aadhar_card}`} target="_blank" rel="noopener noreferrer" className="btn-action outline document-btn">📄 View Identity File</a>
                  ) : <p className="error-text">No document file on record.</p>}
                </div>
              </div>
            ) : (
              <EditProfileComp 
                initialData={patientData.profile}
                role="Patient"
                onCancel={() => setIsEditing(false)}
                onUpdateSuccess={(updatedFields) => {
                  setPatientData({ ...patientData, profile: { ...patientData.profile, ...updatedFields } });
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="history-section">
            <h2>Medical History & Prescriptions</h2>
            <div className="history-list">
              {prescriptions.length > 0 ? (
                prescriptions.map(pres => (
                  <div key={pres._id} className="prescription-card">
                    <div className="prescription-header">
                      <div>
                        <h4 className="diagnosis-title">Diagnosis: {pres.diagnosis}</h4>
                        <p className="doctor-meta">By <strong>Dr. {pres.doctor_name}</strong> on {pres.date}</p>
                      </div>
                      <button onClick={() => downloadPDF(pres)} className="btn-download">Download PDF</button>
                    </div>
                    <div className="medicine-summary-box">
                      <p className="medicines-heading">Medicines:</p>
                      <ul className="medicines-list">
                        {pres.medicines.map((m, i) => <li key={i}>{m.name} — {m.dosage} ({m.duration})</li>)}
                      </ul>
                    </div>
                  </div>
                ))
              ) : ( <div className="no-data-card"><p>No prescriptions found.</p></div> )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;