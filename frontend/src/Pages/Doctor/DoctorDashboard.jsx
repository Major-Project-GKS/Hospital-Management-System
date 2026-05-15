import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
              <img src={`${UPLOADS_URL}${doctorData.profile.photo}`} alt="Doc" style={{width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover'}} />
            ) : "👨‍⚕️"}
          </div>
          <h3>Dr. {doctorData.profile.name}</h3>
          <p>{doctorData.profile.department} | {doctorData.profile.doctor_id}</p>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>Dashboard</li>
          <li className={activeTab === 'Queue' ? 'active' : ''} onClick={() => setActiveTab('Queue')}>Patient Queue</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>My Profile</li>
          <li className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {activeTab === 'Dashboard' && (
          <div className="welcome-box">
             <h2>Welcome back, Dr. {doctorData.profile.name.split(' ')[0]}! 👋</h2>
             <p>You have {doctorData.queue.filter(q => q.status === 'Waiting').length} total patients waiting in your queue.</p>
          </div>
        )}

        {activeTab === 'Queue' && (
          <div className="queue-section">
             <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
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
                          {p.status !== 'Waiting' && <span style={{color: p.status === 'Completed' ? '#059669' : '#e11d48', fontSize:'0.9rem', fontWeight: 'bold'}}>{p.status}</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No matching patients found.</td></tr>
                  )}
                </tbody>
             </table>
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