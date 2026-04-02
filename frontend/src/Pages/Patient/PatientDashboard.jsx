import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Mock Data for the Patient
  const patientDetails = { name: 'Rahul Verma', id: 'PT1023', bloodGroup: 'O+' };
  
  const upcomingAppointment = {
    id: 'AP1234',
    doctor: 'Dr. Ramesh Sharma',
    department: 'Cardiology',
    date: '2026-04-05',
    time: '10:30 AM',
    status: 'Confirmed',
    serial: 5
  };

  const pastAppointments = [
    { id: 'AP0987', date: '2025-11-12', doctor: 'Dr. Anita Desai', department: 'Neurology', status: 'Completed', prescription: true },
    { id: 'AP0855', date: '2025-08-05', doctor: 'Dr. John Smith', department: 'Orthopedics', status: 'Completed', prescription: true },
  ];

  const contentRef = useRef(null);

  // GSAP Animation for content switching
  useEffect(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <div className="patient-dashboard">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          <div className="avatar">👤</div>
          <h3>{patientDetails.name}</h3>
          <p>Patient ID: {patientDetails.id}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => setActiveTab('Overview')}>Dashboard Overview</li>
          <li className={activeTab === 'History' ? 'active' : ''} onClick={() => setActiveTab('History')}>Medical History</li>
          <li><Link to="/appointment" className="sidebar-link">Book New Appointment</Link></li>
          <li className="logout-btn" onClick={() => window.location.href = '/'}>Logout</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content" ref={contentRef}>
        
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <h2>Welcome back, {patientDetails.name.split(' ')[0]}! 👋</h2>
            <p className="subtitle">Here is an overview of your health schedule.</p>

            <div className="dashboard-cards">
              {/* Upcoming Appointment Card */}
              <div className="dash-card primary-card">
                <div className="card-header">
                  <h3>Upcoming Appointment</h3>
                  <span className="badge confirmed">Confirmed</span>
                </div>
                <div className="card-body">
                  <p><strong>Doctor:</strong> {upcomingAppointment.doctor} ({upcomingAppointment.department})</p>
                  <p><strong>Date & Time:</strong> {upcomingAppointment.date} at {upcomingAppointment.time}</p>
                  <div className="ticket-info">
                    <p>Appt ID: <strong>{upcomingAppointment.id}</strong></p>
                    <p>Queue No: <strong className="highlight">{upcomingAppointment.serial}</strong></p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="dash-card action-card">
                <h3>Quick Actions</h3>
                <Link to="/appointment" className="btn-action">📅 Book Appointment</Link>
                <button className="btn-action outline" onClick={() => setActiveTab('History')}>📄 View Prescriptions</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="history-section">
            <h2>Medical History & Prescriptions</h2>
            <p className="subtitle">View your past visits and download digital prescriptions.</p>

            <div className="history-list">
              {pastAppointments.map((appt) => (
                <div className="history-card" key={appt.id}>
                  <div className="hist-details">
                    <h4>{appt.doctor} <span>({appt.department})</span></h4>
                    <p>Date: {appt.date} | Appt ID: {appt.id}</p>
                    <span className="badge completed">Completed</span>
                  </div>
                  <div className="hist-actions">
                    {appt.prescription ? (
                      <button className="btn-download">⬇️ Download Prescription</button>
                    ) : (
                      <span className="no-file">No File Uploaded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PatientDashboard;