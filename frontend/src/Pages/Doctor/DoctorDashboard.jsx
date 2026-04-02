import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Queue');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Patient Queue Data
  const [patientQueue, setPatientQueue] = useState([
    { id: 'AP1042', serial: 1, name: 'Rahul Verma', time: '09:00 AM', status: 'Waiting' },
    { id: 'AP1045', serial: 2, name: 'Priya Sharma', time: '09:15 AM', status: 'Waiting' },
    { id: 'AP1050', serial: 3, name: 'Amit Kumar', time: '09:30 AM', status: 'Waiting' },
    { id: 'AP1055', serial: 4, name: 'Sneha Gupta', time: '09:45 AM', status: 'Waiting' },
  ]);

  const tableRef = useRef(null);

  // Animate table rows on load
  useEffect(() => {
    if (activeTab === 'Queue' && tableRef.current) {
      gsap.fromTo(tableRef.current.children, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  // Handlers for Doctor Actions
  const handleStatusChange = (id, newStatus) => {
    setPatientQueue(prevQueue => 
      prevQueue.map(patient => 
        patient.id === id ? { ...patient, status: newStatus } : patient
      )
    );
  };

  const handleUploadPrescription = (e, patientName) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Prescription uploaded successfully for ${patientName}!`);
      // Future: API call to upload file to backend/AWS S3
    }
  };

  // Filter patients based on search
  const filteredQueue = patientQueue.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="doctor-dashboard">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="doc-profile">
          <div className="avatar">👨‍⚕️</div>
          <h3>Dr. Ramesh</h3>
          <p>Cardiology | DR1001</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>Dashboard</li>
          <li className={activeTab === 'Queue' ? 'active' : ''} onClick={() => setActiveTab('Queue')}>Patient Queue</li>
          <li className={activeTab === 'Schedule' ? 'active' : ''} onClick={() => setActiveTab('Schedule')}>My Schedule</li>
          <li className="logout-btn" onClick={() => window.location.href = '/'}>Logout</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        
        {activeTab === 'Queue' && (
          <div className="queue-section">
            <div className="section-header">
              <h2>Today's Patient Queue</h2>
              <input 
                type="text" 
                placeholder="Search patient name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="table-container">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Serial No.</th>
                    <th>Appt ID</th>
                    <th>Patient Name</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef}>
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map((patient) => (
                      <tr key={patient.id} className={patient.status.toLowerCase()}>
                        <td><strong>#{patient.serial}</strong></td>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.time}</td>
                        <td>
                          <span className={`status-badge ${patient.status.toLowerCase()}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="action-buttons">
                          {patient.status === 'Waiting' && (
                            <>
                              <button className="btn-complete" onClick={() => handleStatusChange(patient.id, 'Completed')}>✅ Complete</button>
                              <button className="btn-absent" onClick={() => handleStatusChange(patient.id, 'Absent')}>❌ Absent</button>
                            </>
                          )}
                          {patient.status === 'Completed' && (
                            <div className="upload-wrapper">
                              <label htmlFor={`upload-${patient.id}`} className="btn-upload">📄 Upload Prescription</label>
                              <input 
                                type="file" 
                                id={`upload-${patient.id}`} 
                                style={{ display: 'none' }} 
                                onChange={(e) => handleUploadPrescription(e, patient.name)}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">No patients found in the queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === 'Dashboard' && <h2>Welcome to your Dashboard. You have {patientQueue.filter(p => p.status === 'Waiting').length} patients waiting today.</h2>}
        {activeTab === 'Schedule' && <h2>Your Schedule View (Coming Soon)</h2>}

      </main>
    </div>
  );
};

export default DoctorDashboard;