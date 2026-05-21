import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditProfileComp from '../../Components/EditProfileComp';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Controls view state toggling
  
  // --- Prescription States ---
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    advice: ''
  });

  const navigate = useNavigate();
  const tableRef = useRef(null);
  const modalRef = useRef(null);
  const UPLOADS_URL = 'http://localhost:5000/uploads/';

  // 1. Fetch Real Data from Backend
  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const docId = localStorage.getItem('userId');
        if (!docId) { navigate('/'); return; }

        const res = await axios.get(`http://localhost:5000/api/doctor/dashboard/${docId}`);
        setDoctorData(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch Error", err);
        localStorage.clear();
        navigate('/');
      }
    };
    fetchDocData();
  }, [navigate]);

  // 2. Handle Real-Time Status Changes
  const handleStatusChange = async (apptId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointment/status/${apptId}`, { 
        status: newStatus 
      });

      setDoctorData(prev => ({
        ...prev,
        queue: prev.queue.map(appt => 
          appt.appointment_id === apptId ? { ...appt, status: newStatus } : appt
        )
      }));
      
      toast.success(`Patient marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status on server");
    }
  };

  // 3. Submit Digital Prescription
  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        appointment_id: selectedAppt.appointment_id,
        patient_id: selectedAppt.patient_id,
        doctor_id: doctorData.profile.doctor_id,
        doctor_name: doctorData.profile.name,
        ...prescriptionData
      };

      await axios.post('http://localhost:5000/api/prescription/add', payload);
      await handleStatusChange(selectedAppt.appointment_id, 'Completed');

      setShowPrescriptionModal(false);
      setPrescriptionData({ diagnosis: '', medicines: [{ name: '', dosage: '', duration: '' }], advice: '' });
      toast.success("Prescription Sent Successfully!");
    } catch (err) {
      toast.error("Failed to save prescription");
    }
  };

  // GSAP for Modal
  useEffect(() => {
    if (showPrescriptionModal) {
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    }
  }, [showPrescriptionModal]);

  if (isLoading) return <div className="loading">Connecting to Doctor Portal...</div>;

  const filteredQueue = doctorData.queue.filter(p => 
    p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.appointment_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="doctor-dashboard">
      <aside className="dashboard-sidebar">
        <div className="doc-profile">
          <div className="avatar">
            {doctorData.profile.photo ? (
              <img src={`${UPLOADS_URL}${doctorData.profile.photo}`} alt="Doc" className="sidebar-profile-photo" />
            ) : "👨‍⚕️"}
          </div>
          <h3>Dr. {doctorData.profile.name}</h3>
          <p>{doctorData.profile.department} | {doctorData.profile.doctor_id}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => { setActiveTab('Dashboard'); setIsEditing(false); }}>Dashboard</li>
          <li className={activeTab === 'Queue' ? 'active' : ''} onClick={() => { setActiveTab('Queue'); setIsEditing(false); }}>Patient Queue</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => { setActiveTab('Profile'); setIsEditing(false); }}>My Profile</li>
          <li className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {/* --- DYNAMIC DASHBOARD OVERVIEW VIEW TAB ✅ --- */}
        {activeTab === 'Dashboard' && (
          <div className="doctor-overview-section">
            {/* Welcome Header Hero Banner */}
            <div className="welcome-box">
               <h2>Welcome back, Dr. {doctorData.profile.name.split(' ')[0]}! 👋</h2>
               <p>Institutional Node: {doctorData.profile.department} | Medical Portal Operational.</p>
            </div>

            {/* Metric Counters Grid Area */}
            <div className="doctor-stats-grid">
              {/* CARD 1: WAITING QUEUE COUNTER */}
              <div className="doc-stat-card amber-glow clickable-tab-card" onClick={() => setActiveTab('Queue')}>
                <div className="card-icon-wrapper">⏳</div>
                <div className="card-metric-info">
                  <h3>{doctorData.queue.filter(q => q.status === 'Waiting').length}</h3>
                  <p>Patients Waiting</p>
                </div>
              </div>

              {/* CARD 2: COMPLETED CHECKUPS COUNTER */}
              <div className="doc-stat-card emerald-glow clickable-tab-card" onClick={() => setActiveTab('Queue')}>
                <div className="card-icon-wrapper">✅</div>
                <div className="card-metric-info">
                  <h3>{doctorData.queue.filter(q => q.status === 'Completed').length}</h3>
                  <p>Completed Checkups</p>
                </div>
              </div>

              {/* CARD 3: TOTAL APPOINTMENTS COUNTER */}
              <div className="doc-stat-card sapphire-glow">
                <div className="card-icon-wrapper">📅</div>
                <div className="card-metric-info">
                  <h3>{doctorData.queue.length}</h3>
                  <p>Total Allocations</p>
                </div>
              </div>
            </div>

            {/* Quick Reference Performance Summary */}
            <div className="queue-summary-preview-card">
              <div className="preview-card-header">
                <h3>Shift Activity Log Summary</h3>
                <button className="btn-view-all" onClick={() => setActiveTab('Queue')}>Go to Patient Queue &rarr;</button>
              </div>
              <div className="preview-metrics-strip">
                <p><strong>Active Department Stream:</strong> {doctorData.profile.department}</p>
                <p><strong>Absent Drop-outs:</strong> {doctorData.queue.filter(q => q.status === 'Absent').length} Cases</p>
                <p><strong>Current Load Factor:</strong> {doctorData.queue.filter(q => q.status === 'Waiting').length > 3 ? "🛑 High Load" : "🟢 Stable Load"}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- PATIENT QUEUE WORKSPACE TAB --- */}
        {activeTab === 'Queue' && (
          <div className="queue-section">
             <div className="section-header">
                <h2>Patient Appointment Queue</h2>
                <input 
                  type="text" 
                  placeholder="Search Name or ID..." 
                  className="search-input"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <table className="queue-table">
                <thead>
                  <tr>
                    <th>Serial</th>
                    <th>Appt ID</th>
                    <th>Patient Name</th>
                    <th>Schedule</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef}>
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map((p) => (
                      <tr key={p.appointment_id}>
                        <td><strong>#{p.serial_number}</strong></td>
                        <td>{p.appointment_id}</td>
                        <td>{p.patient_name}</td>
                        <td>{p.date} | {p.time_slot}</td>
                        <td>
                          <span className={`status-badge ${p.status.toLowerCase()}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.status === 'Waiting' && (
                            <div className="action-btns">
                              <button className="btn-prescribe" onClick={() => {
                                setSelectedAppt(p);
                                setShowPrescriptionModal(true);
                              }}>💊 Prescribe</button>
                              <button className="btn-absent" onClick={() => handleStatusChange(p.appointment_id, 'Absent')}>❌ Absent</button>
                            </div>
                          )}
                          {p.status === 'Waiting' ? null : (
                            <span className={`static-status-text ${p.status.toLowerCase()}`}>
                              {p.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="empty-table-text">No matching patients found.</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        )}

        {/* --- READ-ONLY / EDIT PROFILE MANAGEMENT TAB --- */}
        {activeTab === 'Profile' && (
          <div className="doctor-profile-tab-section">
            <div className="profile-section-header">
              <h2>My Profile Management</h2>
              {!isEditing && <button className="btn-corner-edit" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>}
            </div>

            {!isEditing ? (
              <div className="dash-card profile-details-card">
                <div className="profile-details-grid">
                  <div><h4 className="detail-label">Full Name</h4><p className="detail-value">Dr. {doctorData.profile.name}</p></div>
                  <div><h4 className="detail-label">Specialization Department</h4><p className="detail-value">{doctorData.profile.department}</p></div>
                  <div><h4 className="detail-label">Institutional Contact Email</h4><p className="detail-value">{doctorData.profile.email}</p></div>
                  <div><h4 className="detail-label">Phone Reference</h4><p className="detail-value">+91 {doctorData.profile.phone}</p></div>
                  <div><h4 className="detail-label">Clinical Experience</h4><p className="detail-value">{doctorData.profile.experience} Years</p></div>
                  <div><h4 className="detail-label">Operational Region/City</h4><p className="detail-value">{doctorData.profile.region_city || 'Odisha'}</p></div>
                  <div><h4 className="detail-label">Comfortable Languages</h4><p className="detail-value">{doctorData.profile.comfortable_language || 'English, Hindi'}</p></div>
                  <div><h4 className="detail-label">Assigned Medical State</h4><p className="detail-value">{doctorData.profile.state || 'Odisha'}</p></div>
                </div>
              </div>
            ) : (
              <EditProfileComp 
                initialData={doctorData.profile}
                role="Doctor"
                onCancel={() => setIsEditing(false)}
                onUpdateSuccess={(updatedFields) => {
                  setDoctorData({ ...doctorData, profile: { ...doctorData.profile, ...updatedFields } });
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}

        {/* Prescription Modal Overlay */}
        {showPrescriptionModal && (
          <div className="modal-overlay">
            <div className="prescription-modal" ref={modalRef}>
              <button className="close-modal" onClick={() => setShowPrescriptionModal(false)}>&times;</button>
              <h2>Digital Prescription</h2>
              <p className="modal-subtitle">Patient: <strong>{selectedAppt.patient_name}</strong> | ID: {selectedAppt.patient_id}</p>
              
              <form onSubmit={submitPrescription}>
                <div className="form-group">
                  <label>Diagnosis / Clinical Findings</label>
                  <textarea 
                    required 
                    placeholder="E.g. Mild viral fever, suggest rest..."
                    onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                  ></textarea>
                </div>

                <div className="medicine-list">
                  <label>Medicines</label>
                  {prescriptionData.medicines.map((med, index) => (
                    <div key={index} className="med-row">
                      <input 
                        placeholder="Medicine Name" 
                        required 
                        onChange={(e) => {
                          const newMeds = [...prescriptionData.medicines];
                          newMeds[index].name = e.target.value;
                          setPrescriptionData({...prescriptionData, medicines: newMeds});
                        }}
                      />
                      <input 
                        placeholder="Dosage (1-0-1)" 
                        required 
                        onChange={(e) => {
                          const newMeds = [...prescriptionData.medicines];
                          newMeds[index].dosage = e.target.value;
                          setPrescriptionData({...prescriptionData, medicines: newMeds});
                        }}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn-add-med" onClick={() => {
                    setPrescriptionData({
                      ...prescriptionData, 
                      medicines: [...prescriptionData.medicines, { name: '', dosage: '', duration: '' }]
                    })
                  }}>+ Add Medicine</button>
                </div>

                <div className="form-group">
                  <label>Additional Advice</label>
                  <input 
                    placeholder="Drink plenty of water, avoid cold items..."
                    onChange={(e) => setPrescriptionData({...prescriptionData, advice: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-submit-pres">Send Digital Prescription</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;