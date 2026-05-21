import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditProfileComp from '../../Components/EditProfileComp';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [managerProfile, setManagerProfile] = useState({ name: '', email: '', phone: '', photo: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Controls view state toggling
  
  const navigate = useNavigate();
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const adminId = localStorage.getItem('userId');
        if (!adminId || !adminId.startsWith('HM')) {
          navigate('/');
          return;
        }

        const [statsRes, docsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats'),
          axios.get('http://localhost:5000/api/doctor')
        ]);

        setStats(statsRes.data.data);
        setDoctors(docsRes.data.data);
        
        setManagerProfile({
          name: localStorage.getItem('userName') || 'HMS Administrator',
          email: 'admin@hms.com', 
          phone: '9999999999',
          photo: '' 
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load manager data:", err);
        localStorage.clear();
        navigate('/');
      }
    };
    fetchManagerData();
  }, [navigate]);

  // GSAP Animation for cards
  useEffect(() => {
    if (!isLoading && contentRef.current) {
      gsap.from(".stat-card", { 
        opacity: 0, 
        y: 20, 
        stagger: 0.15, 
        duration: 0.6, 
        ease: "power2.out" 
      });
    }
  }, [isLoading, activeTab]);

  if (isLoading) return <div className="loading-screen"><h2>Accessing Secure Admin Panel... 🛡️</h2></div>;

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <aside className="manager-sidebar">
        <div className="admin-brand">
          <div className="brand-icon">🏥</div>
          <h3>HMS Admin</h3>
          <p>ID: {localStorage.getItem('userId')}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => { setActiveTab('Overview'); setIsEditing(false); }}>Hospital Stats</li>
          <li className={activeTab === 'Doctors' ? 'active' : ''} onClick={() => { setActiveTab('Doctors'); setIsEditing(false); }}>Manage Doctors</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => { setActiveTab('Profile'); setIsEditing(false); }}>My Profile</li>
          <li className={activeTab === 'Schedule' ? 'active' : ''} onClick={() => navigate('/manager/schedule')}>📅Doctor Schedules</li> 
          <li className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="manager-main" ref={contentRef}>
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <header className="content-header">
              <h1>Welcome to the Command Center</h1>
              <p>Real-time hospital operations overview.</p>
            </header>

            <div className="stats-grid">
              <div className="stat-card blue">
                <span className="icon">👨‍⚕️</span>
                <div className="stat-info">
                  <h3>{stats.totalDoctors}</h3>
                  <p>Total Doctors</p>
                </div>
              </div>
              <div className="stat-card green">
                <span className="icon">👤</span>
                <div className="stat-info">
                  <h3>{stats.totalPatients}</h3>
                  <p>Registered Patients</p>
                </div>
              </div>
              <div className="stat-card purple">
                <span className="icon">📅</span>
                <div className="stat-info">
                  <h3>{stats.totalAppointments}</h3>
                  <p>Total Appointments</p>
                </div>
              </div>
            </div>

            <div className="recent-table-wrapper">
              <h3>Recent Appointments</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map(app => (
                    <tr key={app._id}>
                      <td>{app.patient_name}</td>
                      <td>{app.doctor_id}</td>
                      <td>{app.date}</td>
                      <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Doctors' && (
          <div className="doctors-list">
            <header className="content-header">
              <h1>Medical Staff Directory</h1>
              <p>View and manage all registered doctors.</p>
            </header>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc._id}>
                    <td><strong>{doc.doctor_id}</strong></td>
                    <td>{doc.name}</td>
                    <td>{doc.department}</td>
                    <td>{doc.experience} Years</td>
                    <td>{doc.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="manager-profile-tab-section">
            <div className="profile-section-header">
              <h2>Manager Profile Settings</h2>
              {!isEditing && <button className="btn-corner-edit" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>}
            </div>

            {!isEditing ? (
              <div className="dash-card profile-details-card">
                <div className="profile-details-grid">
                  <div><h4 className="detail-label">Administrative Operator</h4><p className="detail-value">{managerProfile.name}</p></div>
                  <div><h4 className="detail-label">System Node Communication Email</h4><p className="detail-value">{managerProfile.email}</p></div>
                  <div><h4 className="detail-label">Secure Access Key ID</h4><p className="detail-value">{localStorage.getItem('userId')}</p></div>
                  <div><h4 className="detail-label">Phone Endpoint</h4><p className="detail-value">+91 {managerProfile.phone}</p></div>
                </div>
              </div>
            ) : (
              <EditProfileComp 
                initialData={managerProfile}
                role="Manager"
                onCancel={() => setIsEditing(false)}
                onUpdateSuccess={(updatedFields) => {
                  setManagerProfile({ ...managerProfile, ...updatedFields });
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;