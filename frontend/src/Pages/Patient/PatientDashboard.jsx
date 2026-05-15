import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]); // New state for prescriptions
  const [isLoading, setIsLoading] = useState(true);
  
  const contentRef = useRef(null);
  const navigate = useNavigate();

  // 1. Fetch Profile and Appointment Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const patientId = localStorage.getItem('userId');
        if (!patientId) {
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/patient/dashboard/${patientId}`);
        setPatientData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        alert("Session expired or error loading data. Please log in again.");
        localStorage.clear();
        navigate('/');
      }
    };
    fetchDashboardData();
  }, [navigate]);

  // 2. Fetch Prescriptions when "History" tab is clicked
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

  // 3. GSAP Animations
  useEffect(() => {
    if (!isLoading && contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab, isLoading]);

  // Placeholder for PDF Download (to be implemented with jspdf)
  const downloadPDF = (pres) => {
    console.log("Downloading PDF for:", pres.appointment_id);
    alert("PDF Download feature coming soon! You can view the details on screen for now.");
  };

  if (isLoading) {
    return (
      <div className="patient-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading your medical records... 🏥</h2>
      </div>
    );
  }

  const UPLOADS_URL = 'http://localhost:5000/uploads/';

  return (
    <div className="patient-dashboard">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          {patientData.profile.photo ? (
             <img 
               src={`${UPLOADS_URL}${patientData.profile.photo}`} 
               alt="Profile" 
               style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
             />
          ) : (
             <div className="avatar">👤</div>
          )}
          <h3>{patientData.profile.name}</h3>
          <p>Patient ID: {patientData.profile.application_id}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => setActiveTab('Overview')}>Dashboard Overview</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>My Profile</li>
          <li className={activeTab === 'History' ? 'active' : ''} onClick={() => setActiveTab('History')}>Medical History</li>
          <li><Link to="/appointment" className="sidebar-link">Book New Appointment</Link></li>
          <li className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content" ref={contentRef}>
        
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <h2>Welcome back, {patientData.profile.name.split(' ')[0]}! 👋</h2>
            <p className="subtitle">Here is an overview of your health schedule.</p>
            
            <div className="dashboard-cards">
              <div className="dash-card primary-card">
                <div className="card-header">
                  <h3>Upcoming Appointment</h3>
                </div>
                <div className="card-body">
                  {patientData.appointments && patientData.appointments.length > 0 ? (
                    <div className="appointment-info-box">
                       {/* Displaying the most recent pending appointment */}
                       <p><strong>Status:</strong> <span className="status-badge">{patientData.appointments[0].status}</span></p>
                       <p><strong>Date:</strong> {patientData.appointments[0].date}</p>
                       <p><strong>Time:</strong> {patientData.appointments[0].time_slot}</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <p>No upcoming appointments.</p>
                      <Link to="/appointment" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                        Book one now &rarr;
                      </Link>
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
            <h2>My Profile Details</h2>
            <div className="dash-card" style={{ marginTop: '20px', padding: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ color: '#666', marginBottom: '5px' }}>Full Name</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{patientData.profile.name}</p>
                </div>
                <div>
                  <h4 style={{ color: '#666', marginBottom: '5px' }}>Email Address</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{patientData.profile.email}</p>
                </div>
                <div>
                  <h4 style={{ color: '#666', marginBottom: '5px' }}>Phone Number</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>+91 {patientData.profile.phone}</p>
                </div>
                <div>
                  <h4 style={{ color: '#666', marginBottom: '5px' }}>Aadhar Number</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {patientData.profile.aadhar_number.replace(/(\d{4})/g, '$1 ').trim()}
                  </p>
                </div>
              </div>
              <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />
              <div>
                <h4 style={{ color: '#666', marginBottom: '15px' }}>Identity Documents</h4>
                {patientData.profile.aadhar_card ? (
                  <a href={`${UPLOADS_URL}${patientData.profile.aadhar_card}`} target="_blank" rel="noopener noreferrer" className="btn-action outline">
                    📄 View Aadhar Card Document
                  </a>
                ) : <p style={{ color: 'red' }}>No Aadhar card uploaded.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="history-section">
            <h2>Medical History & Prescriptions</h2>
            <p className="subtitle">View your past visits and download digital prescriptions.</p>
            <div className="history-list">
              {prescriptions.length > 0 ? (
                prescriptions.map(pres => (
                  <div key={pres._id} className="prescription-card" style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Diagnosis: {pres.diagnosis}</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#7f8c8d' }}>
                          By <strong>Dr. {pres.doctor_name}</strong> on {pres.date}
                        </p>
                      </div>
                      <button onClick={() => downloadPDF(pres)} className="btn-download">Download PDF</button>
                    </div>
                    
                    <div style={{ marginTop: '15px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>Medicines:</p>
                      <ul style={{ paddingLeft: '20px', margin: '0' }}>
                        {pres.medicines.map((m, i) => (
                          <li key={i} style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                            {m.name} — {m.dosage} ({m.duration})
                          </li>
                        ))}
                      </ul>
                    </div>
                    {pres.advice && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Advice:</strong> {pres.advice}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-data-card" style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '10px' }}>
                  <p>No prescriptions found. Once a doctor completes your visit, your prescription will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PatientDashboard;