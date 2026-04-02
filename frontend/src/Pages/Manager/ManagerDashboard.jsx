import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './ManagerDashboard.css';
import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const { user, logout } = useAuth(); // Using your new context!
  const [activeTab, setActiveTab] = useState('Overview');
  const contentRef = useRef(null);

  // Mock stats
  const stats = { totalDoctors: 24, totalPatients: 142, activeAppointments: 38 };

  useEffect(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <div className="manager-dashboard">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          <div className="avatar">🏢</div>
          <h3>{user?.name || 'Hospital Admin'}</h3>
          <p>Manager ID: {user?.id || 'HM1001'}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => setActiveTab('Overview')}>Hospital Overview</li>
          <li><Link to="/manager/schedule" className="sidebar-link">Manage Doctor Schedules</Link></li>
          <li className="logout-btn" onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content" ref={contentRef}>
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <h2>Hospital Management Overview</h2>
            <p className="subtitle">Monitor daily operations and staff availability.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <h3>Total Doctors</h3>
                  <h2>{stats.totalDoctors}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤒</div>
                <div className="stat-info">
                  <h3>Registered Patients</h3>
                  <h2>{stats.totalPatients}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Today's Appointments</h3>
                  <h2>{stats.activeAppointments}</h2>
                </div>
              </div>
            </div>

            <div className="action-panel">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/manager/schedule" className="btn-primary">Assign Doctor Schedules</Link>
                <Link to="/login" className="btn-secondary">Register New Doctor</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;